import { Router } from "express";
import {
    updateProfile,
    deleteAccount,
    getSuggestedConnections,
    searchUsers,
    getPublicProfile

} from "../controllers/userController.mjs";

const router = Router();


/**
 * @route PATCH /api/v1/users/profile
 * @desc Update user profile details
 * @access Private (requires authentication)
 */
router.patch("/profile", updateProfile);

/**
 * @route DELETE /api/v1/users/delete-account
 * @desc Permanently delete a user account
 * @access Private (requires authentication)
 */
router.delete("/delete-account", deleteAccount);

/**
 * @route GET /api/v1/users/suggestions
 * @desc Get a list of suggested connections for the authenticated user
 * @access Private (requires authentication)
 */
router.get("/suggestions", getSuggestedConnections);

/**
 * @route GET /api/v1/users/search
 * @desc Search users by name, username, headline or other criteria
 * @access Public
 */
router.get("/search", searchUsers);

/**
 * @route GET /api/v1/users/:username
 * @desc Get public profile of a user by username
 * @access Public
 */
router.get("/:username", getPublicProfile);


export default router;