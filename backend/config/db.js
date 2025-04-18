// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('MongoDB: Attempting connection...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB: Successfully connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;