// backend/routes/api/categories.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const categoryController = require('../../controllers/api/categoryController');
const { check, validationResult } = require('express-validator');

// Validation middleware
const validateCategory = [
    check('name', 'Name is required').not().isEmpty(),
    check('type').optional().isIn(['expense', 'income']),
    check('color').optional().isString(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, categoryController.getAll);

// @route   POST api/categories
// @desc    Create a category
// @access  Private
router.post('/', [auth, validateCategory], categoryController.create);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', [auth, validateCategory], categoryController.update);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, categoryController.delete);

module.exports = router;