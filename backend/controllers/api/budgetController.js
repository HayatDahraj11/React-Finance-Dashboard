// controllers/api/budgetController.js
const Budget = require('../../models/Budget');
const Category = require('../../models/Category');

const budgetController = {
  // Create new budget
  create: async (req, res) => {
    try {
      const { month, totalBudget, categories } = req.body;

      // Validate if budget already exists for this month
      const existingBudget = await Budget.findOne({
        user: req.user.id,
        month: new Date(month)
      });

      if (existingBudget) {
        return res.status(400).json({
          message: 'Budget already exists for this month'
        });
      }

      // Validate categories
      for (const category of categories) {
        const categoryExists = await Category.findOne({
          _id: category.category,
          user: req.user.id
        });

        if (!categoryExists) {
          return res.status(400).json({
            message: `Category ${category.category} not found`
          });
        }
      }

      const budget = new Budget({
        user: req.user.id,
        month: new Date(month),
        totalBudget,
        categories,
        alerts: {
          threshold: 80,
          enabled: true
        }
      });

      await budget.save();

      const populatedBudget = await Budget.findById(budget._id)
        .populate('categories.category');

      res.status(201).json(populatedBudget);
    } catch (error) {
      console.error('Budget creation error:', error);
      res.status(500).json({
        message: 'Error creating budget'
      });
    }
  },

  // Get all budgets for user
  getAll: async (req, res) => {
    try {
      const budgets = await Budget.find({ user: req.user.id })
        .populate('categories.category')
        .sort({ month: -1 });

      res.json(budgets);
    } catch (error) {
      console.error('Get budgets error:', error);
      res.status(500).json({
        message: 'Error fetching budgets'
      });
    }
  },

  // Get budget by month
  getByMonth: async (req, res) => {
    try {
      const { month } = req.params;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const budget = await Budget.findOne({
        user: req.user.id,
        month: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('categories.category');

      if (!budget) {
        return res.status(404).json({
          message: 'Budget not found for this month'
        });
      }

      res.json(budget);
    } catch (error) {
      console.error('Get budget by month error:', error);
      res.status(500).json({
        message: 'Error fetching budget'
      });
    }
  },

  // Update budget
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { totalBudget, categories, alerts } = req.body;

      const budget = await Budget.findOne({
        _id: id,
        user: req.user.id
      });

      if (!budget) {
        return res.status(404).json({
          message: 'Budget not found'
        });
      }

      // Validate categories
      if (categories) {
        for (const category of categories) {
          const categoryExists = await Category.findOne({
            _id: category.category,
            user: req.user.id
          });

          if (!categoryExists) {
            return res.status(400).json({
              message: `Category ${category.category} not found`
            });
          }
        }
      }

      const updatedBudget = await Budget.findByIdAndUpdate(
        id,
        {
          $set: {
            totalBudget: totalBudget || budget.totalBudget,
            categories: categories || budget.categories,
            alerts: alerts || budget.alerts
          }
        },
        { new: true }
      ).populate('categories.category');

      res.json(updatedBudget);
    } catch (error) {
      console.error('Update budget error:', error);
      res.status(500).json({
        message: 'Error updating budget'
      });
    }
  },

  // Delete budget
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findOne({
        _id: id,
        user: req.user.id
      });

      if (!budget) {
        return res.status(404).json({
          message: 'Budget not found'
        });
      }

      await Budget.findByIdAndDelete(id);

      res.json({
        message: 'Budget deleted successfully'
      });
    } catch (error) {
      console.error('Delete budget error:', error);
      res.status(500).json({
        message: 'Error deleting budget'
      });
    }
  },

  // Get budget analytics
  getAnalytics: async (req, res) => {
    try {
      const { month } = req.query;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const budget = await Budget.findOne({
        user: req.user.id,
        month: {
          $gte: startDate,
          $lte: endDate
        }
      }).populate('categories.category');

      if (!budget) {
        return res.status(404).json({
          message: 'Budget not found for this month'
        });
      }

      // Calculate category-wise allocations
      const categoryAllocations = budget.categories.map(cat => ({
        name: cat.category.name,
        amount: cat.amount,
        percentage: (cat.amount / budget.totalBudget) * 100
      }));

      // Get historical budget data
      const historicalBudgets = await Budget.find({
        user: req.user.id,
        month: { $lt: startDate }
      })
      .sort({ month: -1 })
      .limit(6);

      const budgetTrends = historicalBudgets.map(b => ({
        month: b.month,
        totalBudget: b.totalBudget
      }));

      res.json({
        currentBudget: {
          total: budget.totalBudget,
          categoryAllocations
        },
        trends: budgetTrends,
        alerts: budget.alerts
      });
    } catch (error) {
      console.error('Budget analytics error:', error);
      res.status(500).json({
        message: 'Error fetching budget analytics'
      });
    }
  }
};

module.exports = budgetController;