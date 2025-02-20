import { Router } from "express";
import {
    getPostComments,
    commentOnPost,
    updateComment,
    deleteComment
} from "../controllers/commentController.mjs";


const router = Router();

/**
 * @route GET /api/v1/comments/:postId
 * @desc Get paginated comments for a particular post
 * @access Private (requires authentication)
 */
router.get("/:postId", getPostComments);

/**
 * @route POST /api/v1/comments/:postId
 * @desc Add a comment to a post
 * @access Private (requires authentication)
 */
router.post("/:postId", commentOnPost);

/**
 * @route PATCH /api/v1/comments/:commentId
 * @desc Update a comment (only the comment author can edit)
 * @access Private (requires authentication)
 */
router.patch("/:commentId", updateComment)

/**
 * @route DELETE /api/v1/comments/:commentId
 * @desc Delete a comment (only the comment author or post owner can delete)
 * @access Private (requires authentication)
 */
router.delete("/:commentId", deleteComment);

export default router;