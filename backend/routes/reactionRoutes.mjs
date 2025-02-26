import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.mjs';
import {
    validateGetPostReactions,
    validateToggleReaction
} from '../validations/reactionValidations.mjs';
import {
    getPostReactions,
    toggleReaction,
} from '../controllers/reactionController.mjs';

const router = Router();

/**
 * @route GET /api/v1/reactions/:postId
 * @desc Get post reactions details
 * @access Private (requires authentication)
 */
router.get("/:postId", validateGetPostReactions, validateRequest, getPostReactions);

/**
 * @route POST /api/v1/reactions/:postId
 * @desc React to a post (like, celebrate, support, love, insightful, funny)
 * @access Private (Authenticated users only)
 */
router.post("/:postId", validateToggleReaction, validateRequest, toggleReaction);


export default router;