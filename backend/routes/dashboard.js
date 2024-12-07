// routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        res.json({
            msg: "Protected Dashboard Data",
            userData: {
                userId: req.user.id,
                timestamp: new Date(),
                access: "granted"
            }
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;