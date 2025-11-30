import mongoose, {Document, Schema} from "mongoose";

export interface IPost extends Document {
    title: string;
    content: {
        text: string;
        imageUrl?: string[];
    }
    author: mongoose.Types.ObjectId;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const postSchema : Schema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    content:{
        text:{
            type: String,
            required: true,
            minlength: 10,
            maxlength: 5000
        },
        imageUrl:[{
            type: String
        }]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
        },
    { timestamps: true }
);

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;