import type { Request, Response, NextFunction } from 'express';
import Post from '../models/post_models.ts'; 


// This middleware checks if the logged-in user is the author of the post specified by the ID in req.params

export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Get the Post ID from the URL parameters
        // i use the route syntax /api/posts/:id for PUT/DELETE
        const { id } = req.params; 
        
        // 2. Get the logged-in user's ID from the request object (attached by 'authenticate')
        // We use lowercase 'user' as per the standard convention
        const loggedInUser = (req as any).User; 
        //console.log('Logged-in User ID:', loggedInUserId);
        
        // 3. Find the post by ID and select only the 'author' field
        const post = await Post.findById(id).select('author');

        // Check 3.1: Does the post exist?
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        //added admin bypass ownerShip check
        if (loggedInUser && loggedInUser.isAdmin){
            console.log(`${loggedInUser.username} is admin, bypassing ownership check`);
            return next();
        }
        // Check 3.2: Does the logged-in user's ID match the post's author ID?
        if (!post.author.equals(loggedInUser._id)) {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to modify this post.' });
        }

        // 4. Authorization Success: Proceed to the next middleware or controller (e.g., updatePost or deletePost)
        next();
        
    } catch (error) {
        // This usually catches a Mongoose CastError if the ID in req.params is invalid (not a 24-char hex string)
        if (error instanceof Error && (error as any).kind === 'ObjectId') {
                return res.status(400).json({ message: 'Invalid Post ID format.' });
        }
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Server error during authorization.' });
    }
};

export default isAuthor;