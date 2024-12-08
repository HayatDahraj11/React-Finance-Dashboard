// backend/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Date,
        required: true
    },
    totalBudget: {
        type: Number,
        required: true
    },
    categories: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    alerts: {
        threshold: {
            type: Number,
            default: 80 // percentage
        },
        enabled: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);