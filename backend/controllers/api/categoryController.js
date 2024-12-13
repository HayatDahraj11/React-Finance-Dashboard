// backend/controllers/api/categoryController.js
const Category = require('../../models/Category');

const categoryController = {
    // Get all categories for a user
    getAll: async (req, res) => {
        try {
            const categories = await Category.find({ user: req.user.id });
            res.json(categories);
        } catch (error) {
            console.error('Get categories error:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    },

    // Create new category
    create: async (req, res) => {
        try {
            const { name, type, color } = req.body;
            const category = new Category({
                name,
                type: type || 'expense',
                color: color || '#000000',
                user: req.user.id
            });
            await category.save();
            res.status(201).json(category);
        } catch (error) {
            console.error('Create category error:', error);
            res.status(500).json({ message: 'Error creating category' });
        }
    },

    // Update category
    update: async (req, res) => {
        try {
            const { name, type, color } = req.body;
            const category = await Category.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { name, type, color },
                { new: true }
            );
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (error) {
            console.error('Update category error:', error);
            res.status(500).json({ message: 'Error updating category' });
        }
    },

    // Delete category
    delete: async (req, res) => {
        try {
            const category = await Category.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ message: 'Error deleting category' });
        }
    },

    // Create default categories for new user
    createDefaultCategories: async (userId) => {
        const defaultCategories = [
            { name: 'Food', color: '#FF6384' },
            { name: 'Entertainment', color: '#36A2EB' },
            { name: 'Bills', color: '#FFCE56' },
            { name: 'Transportation', color: '#4BC0C0' },
            { name: 'Savings', color: '#9966FF' },
            { name: 'Miscellaneous', color: '#FF9F40' }
        ];

        try {
            const categories = await Promise.all(
                defaultCategories.map(category => 
                    Category.create({
                        ...category,
                        user: userId,
                        isDefault: true,
                        type: 'expense'
                    })
                )
            );
            return categories;
        } catch (error) {
            console.error('Error creating default categories:', error);
            throw error;
        }
    }
};

module.exports = categoryController;