// backend/controllers/api/transactionController.js
const Transaction = require('../../models/Transaction');
const Category = require('../../models/Category');

const transactionController = {
    // Create new transaction
    create: async (req, res) => {
        try {
            const { amount, type, category, description, date } = req.body;
            
            // Verify category exists
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ msg: 'Category not found' });
            }

            const transaction = new Transaction({
                user: req.user.id,
                amount,
                type,
                category,
                description,
                date: date || Date.now()
            });

            await transaction.save();
            
            // Populate category details
            await transaction.populate('category', 'name color');
            
            res.json(transaction);
        } catch (error) {
            console.error('Transaction creation error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get all transactions for a user
    getAll: async (req, res) => {
        try {
            const { startDate, endDate, type, category } = req.query;
            let query = { user: req.user.id };

            // Add date range filter if provided
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Add type filter if provided
            if (type) {
                query.type = type;
            }

            // Add category filter if provided
            if (category) {
                query.category = category;
            }

            const transactions = await Transaction.find(query)
                .populate('category', 'name color')
                .sort({ date: -1 });

            res.json(transactions);
        } catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get transaction by ID
    getById: async (req, res) => {
        try {
            const transaction = await Transaction.findOne({
                _id: req.params.id,
                user: req.user.id
            }).populate('category', 'name color');

            if (!transaction) {
                return res.status(404).json({ msg: 'Transaction not found' });
            }

            res.json(transaction);
        } catch (error) {
            console.error('Get transaction error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Update transaction
    update: async (req, res) => {
        try {
            const { amount, type, category, description, date } = req.body;

            // Verify category if provided
            if (category) {
                const categoryExists = await Category.findById(category);
                if (!categoryExists) {
                    return res.status(404).json({ msg: 'Category not found' });
                }
            }

            const transaction = await Transaction.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { amount, type, category, description, date },
                { new: true }
            ).populate('category', 'name color');

            if (!transaction) {
                return res.status(404).json({ msg: 'Transaction not found' });
            }

            res.json(transaction);
        } catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({ msg: 'Server error' });
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
                return res.status(404).json({ msg: 'Transaction not found' });
            }

            res.json({ msg: 'Transaction deleted' });
        } catch (error) {
            console.error('Delete transaction error:', error);
            res.status(500).json({ msg: 'Server error' });
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

            const categorySummary = await Transaction.aggregate([
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
                categorySummary
            });
        } catch (error) {
            console.error('Get summary error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    }
};

module.exports = transactionController;