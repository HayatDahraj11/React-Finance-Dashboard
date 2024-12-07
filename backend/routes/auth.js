// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // Add this line

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        console.log('Registration attempt:', req.body.email);

        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            console.log('User exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('User saved:', email);

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                console.log('Token generated for:', email);
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);

        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                console.log('Login successful:', email);
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// New Protected Route - Get User Profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Profile error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// New Protected Route - Verify Token
router.get('/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ valid: true, user });
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;