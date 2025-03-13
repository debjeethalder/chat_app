import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'You need to login first' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token, please log in again' });
        }

        console.log('Decoded ID:', decoded.id);
        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'No user found with this ID' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Error in the code is:', error.message);
        res.status(500).json({ message: 'middleware Server error' });
    }
};