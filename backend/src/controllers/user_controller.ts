import User from '../models/user_models.ts';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import createToken from '../utils/create_token.ts';

const registerUser  = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email});
    if (existingUser) {
        return res.status(409).json({message: 'User with this email already exists'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({username, email, password: hashedPassword });
    await newUser.save();
    createToken(res, newUser._id.toString());
    return res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error){
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
    const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email}).select('+password');
    if (existingUser && existingUser.password) {
        const valid_password = await bcrypt.compare(password, existingUser.password);
        if (valid_password) {
        createToken(res, existingUser._id.toString());
        return res.status(200).json({ 
            message: 'Login successful', 
            userId: existingUser._id
        });
    }
    return res.status(401).json({message: 'Invalid email or password'});
    }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

const logoutUser = (req: Request, res: Response) => {
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(200).json({ message: 'Logout successful' });
}

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).User._id;
        const user = await User.findById(userId).select('-password');
        if (user) {
            return res.status(200).json({ user });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

export { 
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser, 
};
