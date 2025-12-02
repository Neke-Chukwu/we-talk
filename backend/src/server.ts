import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db_config.ts';
import userRoutes from './routes/userRoutes.ts';
import postRoutes from './routes/postRoutes.ts';
import cookiesParser from 'cookie-parser';

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
app.use(cookiesParser());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// setting PORT from .env
const PORT = process.env.PORT || '';

// Server Health Check Endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.send('We-Talk Backend is running!');
});

// Import routes
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});