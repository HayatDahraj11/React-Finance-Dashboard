// routes/dashboard.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        // Only accessible with valid token
        res.json({
            msg: "Authenticated Dashboard Access",
            user: {
                id: req.user.id,
                accessTime: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Dashboard route error:', error);
        res.status(500).json({ 
            msg: 'Server error in dashboard' 
        });
    }
});

module.exports = router;