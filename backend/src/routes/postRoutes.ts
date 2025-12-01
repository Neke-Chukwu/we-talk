import express from 'express';
import {
    createPost,
    getSinglePost,
    getAllPosts,
    updatePost,
    deletePost,
} from '../controllers/post_controller.ts';
import { authenticate } from '../middlewares/auth_Middleware.ts';
import {isAuthor} from '../middlewares/ownership_Middleware.ts';

const router = express.Router();

// Route for creating a new post  
router.route('/create').post(authenticate, createPost);

// Route for getting a single post by slug 
router.route('/:slug').get(getSinglePost);

// Route for getting all posts
router.route('/').get(getAllPosts);

// Route for updating a post by ID
router.route('/:id').put(authenticate, isAuthor, updatePost);

// Route for deleting a post by ID
router.route('/:id').delete(authenticate, isAuthor, deletePost);

export default router;