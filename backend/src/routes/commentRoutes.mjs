import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as CommentController from "../controllers/commentController.mjs";
import * as  CommentValidation  from "../validations/commentValidations.mjs";


const router = Router();


/**
 * @route GET /api/v1/comments/:postId
 * @desc Get paginated comments for a particular post
 * @access Private (requires authentication)
 */
router.get(
    "/:postId", 
    CommentValidation.validateGetPostComments,
    validateRequest,
    CommentController.getPostComments
);


/**
 * @route POST /api/v1/comments/:postId
 * @desc Add a comment to a post
 * @access Private (requires authentication)
 */
router.post(
    "/:postId", 
    CommentValidation.validateCommentOnPost,
    validateRequest, 
    CommentController.commentOnPost
);


/**
 * @route PATCH /api/v1/comments/:commentId
 * @desc Update a comment (only the comment author can edit)
 * @access Private (requires authentication)
 */
router.patch(
    "/:commentId",
    CommentValidation.validateUpdateComment,
    validateRequest,
    CommentController.updateComment
);


/**
 * @route DELETE /api/v1/comments/:commentId
 * @desc Delete a comment (only the comment author or post owner can delete)
 * @access Private (requires authentication)
 */
router.delete(
    "/:commentId",
    CommentValidation.validateDeleteComment,
    validateRequest,
    CommentController.deleteComment
);


export default router;