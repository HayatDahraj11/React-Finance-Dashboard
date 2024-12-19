// backend/controllers/api/dashboardController.js
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const mongoose = require('mongoose');

const dashboardController = {
    getDashboardData: async (req, res) => {
        try {
            const userId = req.user.id;
            const currentDate = new Date();
            const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            // Get all categories and identify savings category
            const allCategories = await Category.find({ user: userId });
            const savingsCategory = allCategories.find(cat => cat.name === 'Savings');

            // Get current month's budget
            const currentBudget = await Budget.findOne({
                user: userId,
                month: {
                    $gte: currentMonth,
                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                }
            }).populate('categories.category');

            // Get monthly budgets for last 6 months
            const monthlyBudgets = await Budget.find({
                user: userId,
                month: { $gte: sixMonthsAgo }
            }).populate('categories.category').sort({ month: 1 });

            // Get current month's transactions
            const currentTransactions = await Transaction.find({
                user: userId,
                date: {
                    $gte: currentMonth,
                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                }
            }).populate('category');

            // Initialize dashboard data structure
            const dashboardData = {
                budgetOverview: {
                    totalBudget: currentBudget?.totalBudget || 0,
                    spent: 0,
                    remaining: currentBudget?.totalBudget || 0,
                    categories: {}
                },
                expenseSummary: {
                    total: 0,
                    categories: {}
                },
                savingsData: {
                    current: {
                        goal: 0,
                        current: 0
                    },
                    progress: [],
                    months: []
                }
            };

            // Initialize categories for both budget and expenses
            allCategories.forEach(category => {
                const budgetCategory = currentBudget?.categories?.find(
                    bc => bc.category._id.toString() === category._id.toString()
                );

                dashboardData.budgetOverview.categories[category._id] = {
                    name: category.name,
                    amount: budgetCategory?.amount || 0,
                    color: category.color
                };

                if (category._id.toString() !== savingsCategory?._id.toString()) {
                    dashboardData.expenseSummary.categories[category._id] = {
                        name: category.name,
                        amount: 0,
                        color: category.color
                    };
                }
            });

            // Calculate spending and update categories
            let totalSpent = 0;
            let totalSaved = 0;

            currentTransactions.forEach(transaction => {
                const categoryId = transaction.category._id.toString();
                
                if (categoryId === savingsCategory?._id.toString()) {
                    if (transaction.type === 'income') {
                        totalSaved += transaction.amount;
                    }
                } else if (transaction.type === 'expense') {
                    totalSpent += transaction.amount;
                    if (dashboardData.expenseSummary.categories[categoryId]) {
                        dashboardData.expenseSummary.categories[categoryId].amount += transaction.amount;
                    }
                }
            });

            // Update budget overview
            dashboardData.budgetOverview.spent = totalSpent;
            dashboardData.budgetOverview.remaining = Math.max(0, dashboardData.budgetOverview.totalBudget - totalSpent);
            dashboardData.expenseSummary.total = totalSpent;

            // Calculate savings progress for last 6 months
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyProgress = [];

            for (let i = 5; i >= 0; i--) {
                const targetDate = new Date();
                targetDate.setMonth(targetDate.getMonth() - i);
                const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
                const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

                // Find budget for this month
                const monthBudget = monthlyBudgets.find(budget => {
                    const budgetMonth = new Date(budget.month);
                    return budgetMonth.getMonth() === monthStart.getMonth() &&
                           budgetMonth.getFullYear() === monthStart.getFullYear();
                });

                // Get savings allocation from budget
                let monthSavingsGoal = 0;
                if (monthBudget && savingsCategory) {
                    const savingsAllocation = monthBudget.categories.find(
                        cat => cat.category._id.toString() === savingsCategory._id.toString()
                    );
                    monthSavingsGoal = savingsAllocation?.amount || 0;
                }

                // Get actual savings for this month
                const monthTransactions = await Transaction.aggregate([
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(userId),
                            category: savingsCategory ? new mongoose.Types.ObjectId(savingsCategory._id) : null,
                            date: { $gte: monthStart, $lte: monthEnd }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" }
                        }
                    }
                ]);

                const actualSavings = monthTransactions[0]?.total || 0;

                // Add to progress array
                monthlyProgress.push({
                    month: monthNames[monthStart.getMonth()],
                    goal: parseFloat(monthSavingsGoal.toFixed(2)),
                    actual: parseFloat(actualSavings.toFixed(2))
                });

                // Update current month's savings data
                if (i === 0) {
                    dashboardData.savingsData.current = {
                        goal: monthSavingsGoal,
                        current: actualSavings
                    };
                }
            }

            // Update savings progress data
            dashboardData.savingsData.progress = monthlyProgress;
            dashboardData.savingsData.months = monthlyProgress.map(p => p.month);

            res.json(dashboardData);
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
            res.status(500).json({ 
                message: 'Error fetching dashboard data',
                error: error.message 
            });
        }
    }
};

module.exports = dashboardController;