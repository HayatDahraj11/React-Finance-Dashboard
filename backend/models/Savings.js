// backend/models/Savings.js
const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    targetDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'failed'],
        default: 'ongoing'
    },
    categoryImpact: [{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        amount: Number
    }],
    alerts: {
        enabled: {
            type: Boolean,
            default: true
        },
        threshold: {
            type: Number,
            default: 90 // percentage of target
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Saving', savingSchema);

