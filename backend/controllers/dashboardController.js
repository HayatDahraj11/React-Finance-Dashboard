// backend/controllers/api/dashboardController.js
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Saving = require('../models/Savings');

const dashboardController = {
    getDashboardData: async (req, res) => {
        try {
            const userId = req.user.id;
            const currentDate = new Date();
            const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            // Get current month's budget
            const currentBudget = await Budget.findOne({
                user: userId,
                month: {
                    $gte: currentMonth,
                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                }
            }).populate('categories.category');

            // Get all categories
            const categories = await Category.find({ user: userId });

            // Prepare default response structure
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
                    goal: 0,
                    current: 0,
                    progress: [],
                    months: []
                }
            };

            // Format categories
            if (currentBudget) {
                currentBudget.categories.forEach(cat => {
                    dashboardData.budgetOverview.categories[cat.category._id] = {
                        name: cat.category.name,
                        amount: cat.amount,
                        color: cat.category.color
                    };
                });
            } else {
                // Use default categories if no budget exists
                categories.forEach(cat => {
                    dashboardData.budgetOverview.categories[cat._id] = {
                        name: cat.name,
                        amount: 0,
                        color: cat.color
                    };
                });
            }

            // Calculate spending and update categories
            const transactions = await Transaction.find({
                user: userId,
                date: {
                    $gte: currentMonth,
                    $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                }
            }).populate('category');

            let totalSpent = 0;
            transactions.forEach(transaction => {
                if (transaction.type === 'expense') {
                    totalSpent += transaction.amount;
                    const categoryId = transaction.category._id.toString();
                    if (!dashboardData.expenseSummary.categories[categoryId]) {
                        dashboardData.expenseSummary.categories[categoryId] = {
                            name: transaction.category.name,
                            amount: 0,
                            color: transaction.category.color
                        };
                    }
                    dashboardData.expenseSummary.categories[categoryId].amount += transaction.amount;
                }
            });

            dashboardData.budgetOverview.spent = totalSpent;
            dashboardData.budgetOverview.remaining = dashboardData.budgetOverview.totalBudget - totalSpent;
            dashboardData.expenseSummary.total = totalSpent;

            res.json(dashboardData);
        } catch (error) {
            console.error('Dashboard data fetch error:', error);
            res.status(500).json({ message: 'Error fetching dashboard data' });
        }
    }
};

module.exports = dashboardController;