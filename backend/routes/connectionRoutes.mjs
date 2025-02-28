import { Router } from "express";
import {
    validateAcceptConnectionRequest,
    validateGetPendingRequests,
    validateToggleConnectionRequest,
    validateGetUserConnections
} from "../validations/connectionValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import {
    getUserConnections,
    getPendingRequests,
    getPendingRequestsCount,
    toggleConnectionRequest,
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
 * @route GET /api/v1/connections/pending/count
 * @desc Get the count of pending connections requests sent to the authenticated user
 * @access Private (requires authentication)
 */
router.get("/pending/count", getPendingRequestsCount);

/**
 * @route POST /api/v1/connections/:userId
 * @desc Toggle connection request (send or cancel) to a user
 * @access Private (requires authentication)
 */
router.post("/:userId", validateToggleConnectionRequest, validateRequest, toggleConnectionRequest);

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