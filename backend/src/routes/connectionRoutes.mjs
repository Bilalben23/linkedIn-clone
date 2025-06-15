import { Router } from "express";
import * as ConnectionValidation  from "../validations/connectionValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as ConnectionController  from "../controllers/connectionController.mjs";


const router = Router();


/**
 * @route GET /api/v1/connections
 * @desc Get paginated connections for the authenticated user
 * @access Private (requires authentication)
 */
router.get(
    "/", 
    ConnectionValidation.validateGetUserConnections, 
    validateRequest, 
    ConnectionController.getUserConnections
);


/**
 * @route GET /api/v1/connections/pending
 * @desc Get paginated pending connection requests for the authenticated user
 * @access Private (requires authentication)
 */
router.get(
    "/pending",
    ConnectionValidation.validateGetPendingRequests,
    validateRequest, 
    ConnectionController.getPendingRequests
);


/**
 * @route GET /api/v1/connections/pending/count
 * @desc Get the count of pending connections requests sent to the authenticated user
 * @access Private (requires authentication)
 */
router.get(
    "/pending/count",
    ConnectionController.getPendingRequestsCount
);


/**
 * @route POST /api/v1/connections/:userId
 * @desc Toggle connection request (send or cancel) to a user
 * @access Private (requires authentication)
 */
router.post(
    "/:userId",
    ConnectionValidation.validateToggleConnectionRequest, 
    validateRequest,
    ConnectionController.toggleConnectionRequest
);


/**
 * @route PATCH /api/v1/connections/:userId/accept
 * @desc Accept a connection request from a user
 * @access Private (requires authentication)
 */
router.patch(
    "/:userId/accept", 
    ConnectionValidation.validateAcceptConnectionRequest,
    validateRequest, 
    ConnectionController.acceptConnectionRequest
);


/**
 * @route PATCH /api/v1/connections/:userId/reject
 * @desc Reject a connection request from a user
 * @access Private (requires authentication)
 */
router.delete(
    "/:userId/reject",
    ConnectionController.rejectConnectionRequest
);


export default router;