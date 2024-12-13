// backend/routes/api/categories.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const categoryController = require('../../controllers/api/categoryController');

router.get('/', auth, categoryController.getAll);
router.post('/', auth, categoryController.create);

module.exports = router;