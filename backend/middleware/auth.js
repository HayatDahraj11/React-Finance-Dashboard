// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header and remove 'Bearer ' prefix
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        console.log('Received token:', token); // Debug log

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ 
                msg: 'Access denied. No token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded); // Debug log
        
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ 
            msg: 'Invalid token. Access denied.' 
        });
    }
};

module.exports = auth;