// backend/routes/api/transactions.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const transactionController = require('../../controllers/api/transactionController');

// @route   POST api/transactions
// @desc    Create new transaction
// @access  Private
router.post('/', auth, transactionController.create);

// @route   GET api/transactions
// @desc    Get all transactions
// @access  Private
router.get('/', auth, transactionController.getAll);

// @route   GET api/transactions/:id
// @desc    Get transaction by ID
// @access  Private
router.get('/:id', auth, transactionController.getById);

// @route   PUT api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, transactionController.update);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, transactionController.delete);

// @route   GET api/transactions/summary
// @desc    Get transaction summary
// @access  Private
router.get('/summary', auth, transactionController.getSummary);

module.exports = router;