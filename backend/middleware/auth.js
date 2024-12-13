const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        console.log('Received token:', token); // Debug log

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ 
                message: 'Invalid token. Access denied.' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(500).json({ 
            message: 'Server error in auth middleware' 
        });
    }
};

module.exports = auth;