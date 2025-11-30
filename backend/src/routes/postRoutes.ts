import express from 'express';
import {
    createPost,
    getSinglePost,
    getAllPosts
} from '../controllers/post_controller.ts';
import { authenticate } from '../middlewares/auth_Middleware.ts';

const router = express.Router();

// Route for creating a new post  
router.route('/create').post(authenticate, createPost);

// Route for getting a single post by slug 
router.route('/:slug').get(getSinglePost);

// Route for getting all posts
router.route('/').get(getAllPosts);

export default router;