// backend/controllers/api/budgetController.js
const Budget = require('../../models/Budget');
const Transaction = require('../../models/Transaction');
const Category = require('../../models/Category');

const budgetController = {
    // Create monthly budget
    create: async (req, res) => {
        try {
            const { month, totalBudget, categories, alerts } = req.body;

            // Verify all categories exist
            for (const item of categories) {
                const categoryExists = await Category.findOne({
                    _id: item.category,
                    user: req.user.id
                });
                if (!categoryExists) {
                    return res.status(404).json({ 
                        msg: 'Category not found',
                        category: item.category 
                    });
                }
            }

            // Check if budget already exists for this month
            const existingBudget = await Budget.findOne({
                user: req.user.id,
                month: new Date(month)
            });

            if (existingBudget) {
                return res.status(400).json({ msg: 'Budget already exists for this month' });
            }

            const budget = new Budget({
                user: req.user.id,
                month: new Date(month),
                totalBudget,
                categories,
                alerts
            });

            await budget.save();
            
            // Populate category details
            await budget.populate('categories.category', 'name color');
            
            res.json(budget);
        } catch (error) {
            console.error('Budget creation error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get all budgets
    getAll: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            let query = { user: req.user.id };

            if (startDate && endDate) {
                query.month = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const budgets = await Budget.find(query)
                .populate('categories.category', 'name color')
                .sort({ month: -1 });

            // Get actual spending for each budget
            const budgetsWithSpending = await Promise.all(
                budgets.map(async (budget) => {
                    const startOfMonth = new Date(budget.month);
                    const endOfMonth = new Date(budget.month);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);

                    const spending = await Transaction.aggregate([
                        {
                            $match: {
                                user: req.user.id,
                                date: {
                                    $gte: startOfMonth,
                                    $lte: endOfMonth
                                },
                                type: 'expense'
                            }
                        },
                        {
                            $group: {
                                _id: '$category',
                                totalSpent: { $sum: '$amount' }
                            }
                        }
                    ]);

                    const categoriesWithSpending = budget.categories.map(cat => {
                        const categorySpending = spending.find(s => 
                            s._id.toString() === cat.category._id.toString()
                        );
                        return {
                            ...cat.toObject(),
                            spent: categorySpending ? categorySpending.totalSpent : 0,
                            remaining: cat.amount - (categorySpending ? categorySpending.totalSpent : 0)
                        };
                    });

                    const totalSpent = spending.reduce((acc, curr) => acc + curr.totalSpent, 0);

                    return {
                        ...budget.toObject(),
                        categories: categoriesWithSpending,
                        totalSpent,
                        remaining: budget.totalBudget - totalSpent
                    };
                })
            );

            res.json(budgetsWithSpending);
        } catch (error) {
            console.error('Get budgets error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get budget by month
    getByMonth: async (req, res) => {
        try {
            const { month } = req.params;
            const startOfMonth = new Date(month);
            const endOfMonth = new Date(month);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            endOfMonth.setDate(0);

            const budget = await Budget.findOne({
                user: req.user.id,
                month: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            }).populate('categories.category', 'name color');

            if (!budget) {
                return res.status(404).json({ msg: 'Budget not found for this month' });
            }

            // Get actual spending
            const spending = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user.id,
                        date: {
                            $gte: startOfMonth,
                            $lte: endOfMonth
                        },
                        type: 'expense'
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        totalSpent: { $sum: '$amount' },
                        transactions: { $push: '$$ROOT' }
                    }
                }
            ]);

            const categoriesWithSpending = budget.categories.map(cat => {
                const categorySpending = spending.find(s => 
                    s._id.toString() === cat.category._id.toString()
                );
                return {
                    ...cat.toObject(),
                    spent: categorySpending ? categorySpending.totalSpent : 0,
                    remaining: cat.amount - (categorySpending ? categorySpending.totalSpent : 0),
                    transactions: categorySpending ? categorySpending.transactions : []
                };
            });

            const totalSpent = spending.reduce((acc, curr) => acc + curr.totalSpent, 0);

            res.json({
                ...budget.toObject(),
                categories: categoriesWithSpending,
                totalSpent,
                remaining: budget.totalBudget - totalSpent
            });
        } catch (error) {
            console.error('Get budget error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Update budget
    update: async (req, res) => {
        try {
            const { totalBudget, categories, alerts } = req.body;

            // Verify all categories if provided
            if (categories) {
                for (const item of categories) {
                    const categoryExists = await Category.findOne({
                        _id: item.category,
                        user: req.user.id
                    });
                    if (!categoryExists) {
                        return res.status(404).json({ 
                            msg: 'Category not found',
                            category: item.category 
                        });
                    }
                }
            }

            const budget = await Budget.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { 
                    ...(totalBudget && { totalBudget }),
                    ...(categories && { categories }),
                    ...(alerts && { alerts })
                },
                { new: true }
            ).populate('categories.category', 'name color');

            if (!budget) {
                return res.status(404).json({ msg: 'Budget not found' });
            }

            res.json(budget);
        } catch (error) {
            console.error('Update budget error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Delete budget
    delete: async (req, res) => {
        try {
            const budget = await Budget.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

            if (!budget) {
                return res.status(404).json({ msg: 'Budget not found' });
            }

            res.json({ msg: 'Budget deleted' });
        } catch (error) {
            console.error('Delete budget error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    }
};

module.exports = budgetController;