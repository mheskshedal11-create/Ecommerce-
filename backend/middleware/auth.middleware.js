import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header('Authorization')?.split(' ')[1]; // Fixed typo here
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in first.'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user based on the decoded ID from the JWT
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Attach the user object to the request (req.user) for further use in the route
        req.user = user;

        // Call the next middleware/route handler
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

export default authMiddleware;
