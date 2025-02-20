import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.mjs";
import {
    signup,
    signin,
    logout,
    refreshToken,
    getCurrentUser
} from "../controllers/authController.mjs";


const router = Router();

/**
 * @route POST /api/v1/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post("/signup", signup);

/**
 * @route POST /api/v1/auth/signin
 * @desc Authenticate user & get access token
 * @access Public
 */
router.post("/signin", signin);

/**
 * @route GET /api/v1/auth/refresh-token
 * @desc Refresh expired access token
 * @access Public (Required refresh token)
 */
router.get("/refresh-token", refreshToken);

/**
 * @route GET /api/v1/auth/logout
 * @desc Logout user & clear cookie
 * @access Private
 */
router.get("/logout", authenticateJWT, logout);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current authenticated user
 * @access Private
 */
router.get("/me", authenticateJWT, getCurrentUser);

export default router;