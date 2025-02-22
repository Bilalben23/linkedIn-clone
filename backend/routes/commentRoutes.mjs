import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import {
    validateCommentOnPost,
    validateDeleteComment,
    validateGetPostComments,
    validateUpdateComment,

} from "../validations/commentValidations.mjs";
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
router.get("/:postId", validateGetPostComments, validateRequest, getPostComments);

/**
 * @route POST /api/v1/comments/:postId
 * @desc Add a comment to a post
 * @access Private (requires authentication)
 */
router.post("/:postId", validateCommentOnPost, validateRequest, commentOnPost);

/**
 * @route PATCH /api/v1/comments/:commentId
 * @desc Update a comment (only the comment author can edit)
 * @access Private (requires authentication)
 */
router.patch("/:commentId", validateUpdateComment, validateRequest, updateComment)

/**
 * @route DELETE /api/v1/comments/:commentId
 * @desc Delete a comment (only the comment author or post owner can delete)
 * @access Private (requires authentication)
 */
router.delete("/:commentId", validateDeleteComment, validateRequest, deleteComment);

export default router;