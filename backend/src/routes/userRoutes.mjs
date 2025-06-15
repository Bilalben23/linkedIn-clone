import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as UserValidation from "../validations/userValidations.mjs";
import * as UserController from "../controllers/userController.mjs";


const router = Router();


/**
 * @route PATCH /api/v1/users/profile
 * @desc Update user profile details
 * @access Private (requires authentication)
 */
router.patch(
    "/profile", 
    UserValidation.updateProfileValidation, 
    validateRequest,
    UserController.updateProfile
);


/**
 * @route DELETE /api/v1/users/delete-account
 * @desc Permanently delete a user account
 * @access Private (requires authentication)
 */
router.delete(
    "/delete-account",
    UserController.deleteAccount
);


/**
 * @route GET /api/v1/users/suggestions
 * @desc Get a list of suggested connections for the authenticated user
 * @access Private (requires authentication)
 */
router.get(
    "/suggestions", 
    UserController.getSuggestedConnections
);


/**
 * @route GET /api/v1/users/search
 * @desc Search users by name, username, headline or other criteria
 * @access Public
 */
router.get(
    "/search",
    UserController.searchUsers
);


/**
 * @route GET /api/v1/users/:username
 * @desc Get public profile of a user by username
 * @access Public
 */
router.get(
    "/:username", 
    UserValidation.validateGetPublicProfile, 
    validateRequest,
    UserController.getPublicProfile
);


export default router;



