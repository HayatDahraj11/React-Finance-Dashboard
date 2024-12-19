// backend/routes/api/transactions.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const transactionController = require('../../controllers/api/transactionController');
const Transaction = require('../../models/Transaction');

// Get all transactions with filters
router.get('/', auth, async (req, res) => {
    try {
        const {
            startDate,
            endDate,
            category,
            minAmount,
            maxAmount,
            type
        } = req.query;

        let query = { user: req.user.id };

        // Add filters to query
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (category) {
            query.category = category;
        }

        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount) query.amount.$gte = parseFloat(minAmount);
            if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
        }

        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .populate('category', 'name color')
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create transaction
router.post('/', auth, async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;

        const newTransaction = new Transaction({
            user: req.user.id,
            amount,
            type,
            category,
            description,
            date: date || Date.now()
        });

        await newTransaction.save();
        await newTransaction.populate('category', 'name color');

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
    try {
        const { amount, type, category, description, date } = req.body;

        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { amount, type, category, description, date },
            { new: true }
        ).populate('category', 'name color');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;