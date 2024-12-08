// backend/routes/api/savings.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const savingsController = require('../../controllers/api/savingsController');

// @route   POST api/savings
// @desc    Create new savings goal
// @access  Private
router.post('/', auth, savingsController.create);

// @route   GET api/savings
// @desc    Get all savings goals
// @access  Private
router.get('/', auth, savingsController.getAll);

// @route   GET api/savings/:id
// @desc    Get savings goal by ID
// @access  Private
router.get('/:id', auth, savingsController.getById);

// @route   PUT api/savings/:id
// @desc    Update savings goal
// @access  Private
router.put('/:id', auth, savingsController.update);

// @route   DELETE api/savings/:id
// @desc    Delete savings goal
// @access  Private
router.delete('/:id', auth, savingsController.delete);

// @route   GET api/savings/stats
// @desc    Get savings statistics
// @access  Private
router.get('/stats', auth, savingsController.getStats);

module.exports = router;