import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.ts';
import userRoutes from './routes/userRoutes.ts';
import cookiesParser from 'cookie-parser';



// Create an Express application
const app = express();
app.use(cookiesParser());
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// Load environment variables from .env file
dotenv.config();



// setting PORT from .env
const PORT = process.env.PORT || "";

// Server Health Check Endpoint
app.get('/api',(_req: Request, res: Response) => {
    res.send('We-Talk Backend is running!');
});

// Import routes
app.use('/api', userRoutes);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api`);
});