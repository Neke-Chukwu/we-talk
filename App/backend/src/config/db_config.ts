import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('MongoDB connected successfully 🎊');
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;