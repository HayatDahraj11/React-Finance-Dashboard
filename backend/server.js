// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');



const app = express();

// Connect Database
console.log('MongoDB: Attempting connection...');
connectDB();

// Initialize Middleware
app.use(cors());
app.use(express.json());




// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/api/transactions'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/budget', require('./routes/api/budget'));
app.use('/api/savings', require('./routes/api/savings'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            error: messages
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'Duplicate field value entered'
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});