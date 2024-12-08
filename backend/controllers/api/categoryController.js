// backend/controllers/api/categoryController.js
const Category = require('../../models/Category');
const Transaction = require('../../models/Transaction');

const categoryController = {
    // Create new category
    create: async (req, res) => {
        try {
            const { name, type, color } = req.body;

            // Check if category already exists for user
            const existingCategory = await Category.findOne({
                user: req.user.id,
                name: name.toLowerCase(),
                type
            });

            if (existingCategory) {
                return res.status(400).json({ msg: 'Category already exists' });
            }

            const category = new Category({
                name: name.toLowerCase(),
                type,
                color,
                user: req.user.id
            });

            await category.save();
            res.json(category);
        } catch (error) {
            console.error('Category creation error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get all categories for a user
    getAll: async (req, res) => {
        try {
            const { type } = req.query;
            let query = { user: req.user.id };

            if (type) {
                query.type = type;
            }

            const categories = await Category.find(query).sort('name');
            
            // Get usage count for each category
            const categoriesWithUsage = await Promise.all(
                categories.map(async (category) => {
                    const count = await Transaction.countDocuments({
                        category: category._id,
                        user: req.user.id
                    });
                    
                    return {
                        ...category.toObject(),
                        usageCount: count
                    };
                })
            );

            res.json(categoriesWithUsage);
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Update category
    update: async (req, res) => {
        try {
            const { name, color } = req.body;

            // Check if new name already exists
            if (name) {
                const existingCategory = await Category.findOne({
                    user: req.user.id,
                    name: name.toLowerCase(),
                    _id: { $ne: req.params.id }
                });

                if (existingCategory) {
                    return res.status(400).json({ msg: 'Category name already exists' });
                }
            }

            const category = await Category.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { 
                    ...(name && { name: name.toLowerCase() }),
                    ...(color && { color })
                },
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ msg: 'Category not found' });
            }

            // Get usage count
            const usageCount = await Transaction.countDocuments({
                category: category._id,
                user: req.user.id
            });

            res.json({
                ...category.toObject(),
                usageCount
            });
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Delete category
    delete: async (req, res) => {
        try {
            const category = await Category.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!category) {
                return res.status(404).json({ msg: 'Category not found' });
            }

            // Check if category is in use
            const transactionCount = await Transaction.countDocuments({
                category: category._id,
                user: req.user.id
            });

            if (transactionCount > 0) {
                return res.status(400).json({ 
                    msg: 'Cannot delete category that is in use',
                    transactionCount
                });
            }

            await category.remove();
            res.json({ msg: 'Category deleted' });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get category statistics
    getStats: async (req, res) => {
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

            const stats = await Transaction.aggregate([
                {
                    $match: {
                        user: req.user.id,
                        ...dateMatch
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 },
                        averageAmount: { $avg: '$amount' },
                        transactions: { $push: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'categoryDetails'
                    }
                },
                {
                    $unwind: '$categoryDetails'
                }
            ]);

            res.json(stats);
        } catch (error) {
            console.error('Get category stats error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    }
};

module.exports = categoryController;