import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();


interface jwtPayload {
        userId: string
}

const createToken = (res: Response, userId: string) => {
        const payload: jwtPayload  = {userId};
        const token = jwt.sign({ payload }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
}

export default createToken