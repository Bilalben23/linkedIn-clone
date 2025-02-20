import { Router } from "express";
import {
    getFeedPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} from "../controllers/postController.mjs";


const router = Router();

/**
 * @route GET /api/v1/posts
 * @desc Get paginated posts for the feed
 * @access Public 
 */
router.get("/", getFeedPosts);

/**
 * @route GET /api/v1/posts/:postId
 * @desc Get a specific post by ID
 * @access Public 
 */
router.get("/:postId", getPostById);

/**
 * @route POST /api/v1/posts
 * @desc Create a new post
 * @access Private (Requires authentication)
 */
router.post("/", createPost);

/**
 * @route PATCH /api/v1/posts/:postId
 * @desc Update an existing post by ID
 * @access Private (Requires authentication)
 */
router.patch("/:postId", updatePost);

/**
 * @route DELETE /api/v1/posts/:postId
 * @desc Delete a post by ID
 * @access Private (Only the author can delete)
 */
router.delete("/:postId", deletePost);


export default router;