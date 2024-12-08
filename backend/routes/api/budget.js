// backend/routes/api/budget.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const budgetController = require('../../controllers/api/budgetController');

// @route   POST api/budget
// @desc    Create new budget
// @access  Private
router.post('/', auth, budgetController.create);

// @route   GET api/budget
// @desc    Get all budgets
// @access  Private
router.get('/', auth, budgetController.getAll);

// @route   GET api/budget/:month
// @desc    Get budget by month
// @access  Private
router.get('/:month', auth, budgetController.getByMonth);

// @route   PUT api/budget/:id
// @desc    Update budget
// @access  Private
router.put('/:id', auth, budgetController.update);

// @route   DELETE api/budget/:id
// @desc    Delete budget
// @access  Private
router.delete('/:id', auth, budgetController.delete);

module.exports = router;