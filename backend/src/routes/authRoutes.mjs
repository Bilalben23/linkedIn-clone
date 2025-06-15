import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.mjs";
import { signinValidation, signupValidation } from "../validations/authValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as AuthController  from "../controllers/authController.mjs";


const router = Router();


/**
 * @route POST /api/v1/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post(
    "/signup",
    signupValidation,
    validateRequest,
    AuthController.signup
);


/**
 * @route POST /api/v1/auth/signin
 * @desc Authenticate user & get access token
 * @access Public
 */
router.post(
    "/signin",
    signinValidation, 
    validateRequest, 
    AuthController.signin
);


/**
 * @route GET /api/v1/auth/refresh-token
 * @desc Refresh expired access token
 * @access Public (Required refresh token)
 */
router.get(
    "/refresh-token", 
    AuthController.refreshToken
);


/**
 * @route GET /api/v1/auth/logout
 * @desc Logout user & clear cookie
 * @access Private
 */
router.get(
    "/logout", 
    authenticateJWT,
    AuthController.logout
);

export default router;