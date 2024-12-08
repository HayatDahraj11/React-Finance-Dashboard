// backend/models/Alert.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['budget', 'saving', 'category', 'monthly'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'],
        default: 'unread'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    relatedDocument: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'documentModel'
    },
    documentModel: {
        type: String,
        enum: ['Budget', 'Saving', 'Transaction'],
        required: function() {
            return this.relatedDocument != null;
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);

// backend/models/UserPreference.js
const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    language: {
        type: String,
        default: 'en'
    },
    notifications: {
        email: {
            enabled: {
                type: Boolean,
                default: true
            },
            frequency: {
                type: String,
                enum: ['instant', 'daily', 'weekly'],
                default: 'instant'
            }
        },
        push: {
            enabled: {
                type: Boolean,
                default: true
            },
            types: {
                budgetAlerts: {
                    type: Boolean,
                    default: true
                },
                savingsAlerts: {
                    type: Boolean,
                    default: true
                },
                monthlyReport: {
                    type: Boolean,
                    default: true
                }
            }
        }
    },
    dashboard: {
        defaultView: {
            type: String,
            enum: ['overview', 'expenses', 'savings', 'budget'],
            default: 'overview'
        },
        widgets: [{
            type: {
                type: String,
                enum: ['expenses', 'savings', 'budget', 'recent-transactions']
            },
            enabled: {
                type: Boolean,
                default: true
            },
            position: {
                type: Number
            }
        }]
    },
    exportPreferences: {
        format: {
            type: String,
            enum: ['pdf', 'csv', 'excel'],
            default: 'pdf'
        },
        includeCategories: {
            type: Boolean,
            default: true
        },
        dateRange: {
            type: String,
            enum: ['last30days', 'last3months', 'last6months', 'lastYear'],
            default: 'last30days'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);