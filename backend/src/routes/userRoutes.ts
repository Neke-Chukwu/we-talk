import { 
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser 
} from '../controllers/user_controller.ts';
import { authenticate } from '../middlewares/auth_Middleware.ts';
import express from 'express';


const router = express.Router();


// Route for registering a new user - handled by registerUser controller
router.route('/register').post(registerUser);
// Route for logging in a user - handled by loginUser controller
router.route('/login').post(loginUser);
// Route for logging out a user - handled by logoutUser controller
router.route('/logout').post(logoutUser);
// user route for getting user profile
router.route('/profile').get(authenticate, getUserProfile); 




export default router;