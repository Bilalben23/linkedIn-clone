import { Router } from "express";
import {
    validateAcceptConnectionRequest,
    validateGetPendingRequests,
    validateGetUserConnections,
    validateSendConnectionRequest
} from "../validations/connectionValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import {
    getUserConnections,
    getPendingRequests,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest
} from "../controllers/connectionController.mjs"


const router = Router();

/**
 * @route GET /api/v1/connections
 * @desc Get paginated connections for the authenticated user
 * @access Private (requires authentication)
 */
router.get("/", validateGetUserConnections, validateRequest, getUserConnections);

/**
 * @route GET /api/v1/connections/pending
 * @desc Get paginated pending connection requests for the authenticated user
 * @access Private (requires authentication)
 */
router.get("/pending", validateGetPendingRequests, validateRequest, getPendingRequests);

/**
 * @route POST /api/v1/connections/:userId
 * @desc Send a connection request to a user
 * @access Private (requires authentication)
 */
router.post("/:userId", validateSendConnectionRequest, validateRequest, sendConnectionRequest);

/**
 * @route PATCH /api/v1/connections/:userId/accept
 * @desc Accept a connection request from a user
 * @access Private (requires authentication)
 */
router.patch("/:userId/accept", validateAcceptConnectionRequest, validateRequest, acceptConnectionRequest);

/**
 * @route PATCH /api/v1/connections/:userId/reject
 * @desc Reject a connection request from a user
 * @access Private (requires authentication)
 */
router.delete("/:userId/reject", rejectConnectionRequest);


export default router;