import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    },

    isAdmin:{
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true});

const User = mongoose.model<IUser>('User', userSchema);
export default User;