// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Test route
router.post('/register', (req, res) => {
    res.json({ msg: 'Register route' });
});

router.post('/login', (req, res) => {
    res.json({ msg: 'Login route' });
});

module.exports = router;