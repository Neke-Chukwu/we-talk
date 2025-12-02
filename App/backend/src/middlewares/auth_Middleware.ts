import User from '../models/user_models.ts';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Middleware to authenticate user using JWT token from cookies
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            //console.log('Decoded JWT:', decoded, 'userId:', decoded.userId);
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                (req as any).User = user;
                next();
            } else {
                res.status(401).json({ message: 'Unauthorized: User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

const admin = (req: Request, res: Response, next: NextFunction) => {
    const user= (req as any).User;
    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};

export { authenticate, admin };