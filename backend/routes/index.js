// backend/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/transactions', require('./api/transactions'));
router.use('/categories', require('./api/categories'));
router.use('/budget', require('./api/budget'));
router.use('/savings', require('./api/savings'));

module.exports = router;