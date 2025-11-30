import Post from '../models/post_models.ts';
import User from '../models/user_models.ts';
import type { Request, Response } from 'express';
import generateUniqueSlug from '../utils/slugify_title.ts'


const createPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { title, content} = req.body;
        if (!title || !content || !content.text) {
            return res.status(400).json({ message: 'Title and content are required fields' });
        }
        const authorId = (req as any).User._id;
        const postSlug = await generateUniqueSlug(title);
        
        const newPost = new Post({
            title,
            content,
            author:authorId,
            slug: postSlug
        })
        await newPost.save();
        return res.status(201).json({ 
            message: 'Post created successfully', 
            postId: newPost._id,
            slug: newPost.slug 
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

const getSinglePost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {slug} = req.params;
        const post = await Post.findOne({slug: slug}).populate('author', 'username');
        if (post) {
            return res.status(200).json({ post });
        }
        return res.status(404).json({ message: 'Post not found' });
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
    try{
        const posts = await Post.find({})
            //.select('-content.text') // Exclude the bulky content text for the list view
            .populate('author', 'username') // Populate with only the username of the author
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(20); // Simple limit for basic pagination
        return res.status(200).json({ posts });
    }
    catch (error){
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}


export { 
    createPost,
    getSinglePost,
    getAllPosts
};