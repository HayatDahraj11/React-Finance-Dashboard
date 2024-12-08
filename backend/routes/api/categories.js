// backend/routes/api/categories.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const categoryController = require('../../controllers/api/categoryController');

// @route   POST api/categories
// @desc    Create new category
// @access  Private
router.post('/', auth, categoryController.create);

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, categoryController.getAll);

// @route   PUT api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', auth, categoryController.update);

// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Private
router.delete('/:id', auth, categoryController.delete);

// @route   GET api/categories/stats
// @desc    Get category statistics
// @access  Private
router.get('/stats', auth, categoryController.getStats);

module.exports = router;