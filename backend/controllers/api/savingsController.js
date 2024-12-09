const Saving = require('../../models/Savings');
const Transaction = require('../../models/Transaction');

const savingsController = {
    // Create savings goal
    create: async (req, res) => {
        try {
            const { title, targetAmount, targetDate, categoryImpact } = req.body;

            const saving = new Saving({
                user: req.user.id,
                title,
                targetAmount,
                targetDate: new Date(targetDate),
                currentAmount: 0,
                categoryImpact: categoryImpact || [],
                status: 'ongoing'
            });

            await saving.save();
            res.json(saving);
        } catch (error) {
            console.error('Savings creation error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get all savings goals
    getAll: async (req, res) => {
        try {
            const savings = await Saving.find({ user: req.user.id })
                .populate('categoryImpact.category', 'name color')
                .sort({ targetDate: 1 });

            // Calculate progress for each savings goal
            const savingsWithProgress = savings.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
                
                return {
                    ...goal.toObject(),
                    progress: Math.round(progress * 100) / 100,
                    daysLeft: daysLeft > 0 ? daysLeft : 0
                };
            });

            res.json(savingsWithProgress);
        } catch (error) {
            console.error('Get savings error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get savings goal by ID
    getById: async (req, res) => {
        try {
            const saving = await Saving.findOne({
                _id: req.params.id,
                user: req.user.id
            }).populate('categoryImpact.category', 'name color');

            if (!saving) {
                return res.status(404).json({ msg: 'Savings goal not found' });
            }

            // Calculate progress
            const progress = (saving.currentAmount / saving.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(saving.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

            // Get related transactions
            const transactions = await Transaction.find({
                user: req.user.id,
                savingsGoal: saving._id
            }).sort({ date: -1 });

            res.json({
                ...saving.toObject(),
                progress: Math.round(progress * 100) / 100,
                daysLeft: daysLeft > 0 ? daysLeft : 0,
                transactions
            });
        } catch (error) {
            console.error('Get savings by ID error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Get savings statistics
    getStats: async (req, res) => {
        try {
            const savings = await Saving.find({ user: req.user.id });
            
            const stats = {
                totalGoals: savings.length,
                totalTargetAmount: savings.reduce((acc, curr) => acc + curr.targetAmount, 0),
                totalCurrentAmount: savings.reduce((acc, curr) => acc + curr.currentAmount, 0),
                completedGoals: savings.filter(goal => goal.status === 'completed').length,
                ongoingGoals: savings.filter(goal => goal.status === 'ongoing').length,
                failedGoals: savings.filter(goal => goal.status === 'failed').length,
                upcomingDeadlines: savings.filter(goal => {
                    const deadline = new Date(goal.targetDate);
                    const now = new Date();
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(now.getDate() + 30);
                    return deadline <= thirtyDaysFromNow && goal.status === 'ongoing';
                })
            };

            // Calculate overall progress
            stats.overallProgress = stats.totalTargetAmount > 0 
                ? (stats.totalCurrentAmount / stats.totalTargetAmount) * 100 
                : 0;

            res.json(stats);
        } catch (error) {
            console.error('Get savings stats error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Update savings goal
    update: async (req, res) => {
        try {
            const { title, targetAmount, targetDate, currentAmount, categoryImpact, status, alerts } = req.body;

            // Validate status if provided
            if (status && !['ongoing', 'completed', 'failed'].includes(status)) {
                return res.status(400).json({ msg: 'Invalid status value' });
            }

            const saving = await Saving.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                {
                    ...(title && { title }),
                    ...(targetAmount && { targetAmount }),
                    ...(targetDate && { targetDate: new Date(targetDate) }),
                    ...(currentAmount !== undefined && { currentAmount }),
                    ...(categoryImpact && { categoryImpact }),
                    ...(status && { status }),
                    ...(alerts && { alerts })
                },
                { new: true }
            ).populate('categoryImpact.category', 'name color');

            if (!saving) {
                return res.status(404).json({ msg: 'Savings goal not found' });
            }

            // Calculate progress
            const progress = (saving.currentAmount / saving.targetAmount) * 100;
            const daysLeft = Math.ceil((new Date(saving.targetDate) - new Date()) / (1000 * 60 * 60 * 24));

            res.json({
                ...saving.toObject(),
                progress: Math.round(progress * 100) / 100,
                daysLeft: daysLeft > 0 ? daysLeft : 0
            });
        } catch (error) {
            console.error('Update savings error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    // Delete savings goal
    delete: async (req, res) => {
        try {
            const saving = await Saving.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

            if (!saving) {
                return res.status(404).json({ msg: 'Savings goal not found' });
            }

            // Also delete or update related transactions
            await Transaction.updateMany(
                { savingsGoal: req.params.id },
                { $unset: { savingsGoal: 1 } }
            );

            res.json({ msg: 'Savings goal deleted' });
        } catch (error) {
            console.error('Delete savings error:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    }
};

module.exports = savingsController;