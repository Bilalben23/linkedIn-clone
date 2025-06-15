import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.mjs';
import * as ReactionValidation from '../validations/reactionValidations.mjs';
import * as ReactionController from '../controllers/reactionController.mjs';


const router = Router();


/**
 * @route GET /api/v1/reactions/:postId
 * @desc Get post reactions details
 * @access Private (requires authentication)
 */
router.get(
    "/:postId",
    ReactionValidation.validateGetPostReactions, 
    validateRequest, 
    ReactionController.getPostReactions
);


/**
 * @route POST /api/v1/reactions/:postId
 * @desc React to a post (like, celebrate, support, love, insightful, funny)
 * @access Private (Authenticated users only)
 */
router.post(
    "/:postId",
    ReactionValidation.validateToggleReaction,
    validateRequest,
    ReactionController.toggleReaction
);


export default router;