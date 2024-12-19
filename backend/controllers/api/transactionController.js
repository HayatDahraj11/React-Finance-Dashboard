// backend/controllers/api/transactionController.js
const Transaction = require('../../models/Transaction');
const Category = require('../../models/Category');

const transactionController = {
    // Get all transactions
    getAll: async (req, res) => {
        try {
            const {
                startDate,
                endDate,
                category,
                minAmount,
                maxAmount,
                type
            } = req.query;

            let query = { user: req.user.id };

            // Add filters to query
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            if (category) {
                query.category = category;
            }

            if (minAmount || maxAmount) {
                query.amount = {};
                if (minAmount) query.amount.$gte = parseFloat(minAmount);
                if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
            }

            if (type) {
                query.type = type;
            }

            const transactions = await Transaction.find(query)
                .populate('category', 'name color')
                .sort({ date: -1 });

            res.json(transactions);
        } catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Create new transaction
    create: async (req, res) => {
        try {
            const { amount, type, category, description, date } = req.body;

            // Verify category exists
            const categoryExists = await Category.findOne({
                _id: category,
                user: req.user.id
            });

            if (!categoryExists) {
                return res.status(404).json({ message: 'Category not found' });
            }

            const newTransaction = new Transaction({
                user: req.user.id,
                amount,
                type,
                category,
                description,
                date: date || Date.now()
            });

            await newTransaction.save();
            await newTransaction.populate('category', 'name color');

            res.status(201).json(newTransaction);
        } catch (error) {
            console.error('Create transaction error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Update transaction
    update: async (req, res) => {
        try {
            const { amount, type, category, description, date } = req.body;

            if (category) {
                const categoryExists = await Category.findOne({
                    _id: category,
                    user: req.user.id
                });

                if (!categoryExists) {
                    return res.status(404).json({ message: 'Category not found' });
                }
            }

            const transaction = await Transaction.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { amount, type, category, description, date },
                { new: true }
            ).populate('category', 'name color');

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            res.json(transaction);
        } catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Delete transaction
    delete: async (req, res) => {
        try {
            const transaction = await Transaction.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            res.json({ message: 'Transaction deleted' });
        } catch (error) {
            console.error('Delete transaction error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get transaction summary
    getSummary: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            
            let dateMatch = {};
            if (startDate && endDate) {
                dateMatch = {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                };
            }

            const summary = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user.id,
                        ...dateMatch
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]);

            const categorySum = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user.id,
                        ...dateMatch
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                }
            ]);

            res.json({
                summary,
                categorySum
            });
        } catch (error) {
            console.error('Get summary error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = transactionController;