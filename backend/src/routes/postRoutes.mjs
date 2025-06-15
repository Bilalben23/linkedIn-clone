import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as PostValidation from "../validations/postValidations.mjs";
import * as PostController from "../controllers/postController.mjs";


const router = Router();


/**
 * @route GET /api/v1/posts
 * @desc Get paginated posts for the feed
 * @access Public 
 */
router.get(
    "/",
    PostValidation.validateGetFeedPosts,
    validateRequest,
    PostController.getFeedPosts
);


/**
 * @route GET /api/v1/posts/:postId
 * @desc Get a specific post by ID
 * @access Public 
 */
router.get(
    "/:postId",
    PostValidation.validateGetPostById,
    validateRequest, 
    PostController.getPostById
);


/**
 * @route POST /api/v1/posts
 * @desc Create a new post
 * @access Private (Requires authentication)
 */
router.post(
    "/", 
    PostValidation.validateCreatePost,
    validateRequest, 
    PostController.createPost
);


/**
 * @route PATCH /api/v1/posts/:postId
 * @desc Update an existing post by ID
 * @access Private (Requires authentication)
 */
router.patch(
    "/:postId",
    PostValidation.validateUpdatePost,
    validateRequest, 
    PostController.updatePost
);


/**
 * @route DELETE /api/v1/posts/:postId
 * @desc Delete a post by ID
 * @access Private (Only the author can delete)
 */
router.delete(
    "/:postId", 
    PostValidation.validateDeletePost,
    validateRequest, 
    PostController.deletePost
);

export default router;