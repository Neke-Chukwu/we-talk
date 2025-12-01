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

const updatePost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {id} = req.params;
        const {title, content} = req.body;
        const updatedData: any = {};
        if (title){
            updatedData.title = title;
            updatedData.slug = await generateUniqueSlug(title);
        }
        if (content){
            updatedData.content = content;
        }
        const update = await Post.findByIdAndUpdate(
            id, 
            { $set: updatedData }, // $set updates only the fields provided
            { new: true, runValidators: true });

        if (!update) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ 
                message: 'Post updated successfully', 
                post: update 
            });
        
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

const deletePost = async (req: Request, res: Response): Promise<Response> => {
    const {id} = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({
            message: 'Post deleted successfully', 
            postId: deletedPost._id
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

export { 
    createPost,
    getSinglePost,
    getAllPosts,
    updatePost,
    deletePost
};