import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.ts';

// Create an Express application
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// Load environment variables from .env file
dotenv.config();



// setting PORT from .env
const PORT = process.env.PORT || 5050;

// Server Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('We-Talk Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});