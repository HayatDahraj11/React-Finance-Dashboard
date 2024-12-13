// routes/api/budget.js
const express = require('express');
const router = express.Router(); // Move this to the top
const auth = require('../../middleware/auth');
const budgetController = require('../../controllers/api/budgetController');
const { check, validationResult } = require('express-validator');

// Validation middleware
const validateBudget = [
  check('month', 'Month is required').not().isEmpty(),
  check('totalBudget', 'Total budget must be a positive number').isFloat({ min: 0 }),
  check('categories', 'Categories must be an array').isArray(),
  check('categories.*.category', 'Category ID is required').not().isEmpty(),
  check('categories.*.amount', 'Category amount must be a positive number').isFloat({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Routes
router.post('/', [auth, validateBudget], budgetController.create);
router.get('/', auth, budgetController.getAll);
router.get('/analytics', auth, budgetController.getAnalytics); // Move this before :month route
router.get('/:month', auth, budgetController.getByMonth);
router.put('/:id', [auth, validateBudget], budgetController.update);
router.delete('/:id', auth, budgetController.delete);

module.exports = router;