import { Router } from 'express';
import {
    getPostLikes,
    toggleLikePost,
} from '../controllers/likeController.mjs';


const router = Router();

/**
 * @route GET /api/v1/likes/:postId
 * @desc Get post likes details
 * @access Private (requires authentication)
 */
router.get("/:postId", getPostLikes);

/**
 * @route POST /api/v1/likes/:postId
 * @desc Like/unlike a post
 * @access Private (Authenticated users only)
 */
router.post("/:postId", toggleLikePost);


export default router;