import { Router } from "express";
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
router.get("/", getUserConnections);

/**
 * @route GET /api/v1/connections/pending
 * @desc Get paginated pending connection requests for the authenticated user
 * @access Private (requires authentication)
 */
router.get("/pending", getPendingRequests);

/**
 * @route POST /api/v1/connections/:userId
 * @desc Send a connection request to a user
 * @access Private (requires authentication)
 */
router.post("/:userId", sendConnectionRequest);

/**
 * @route PATCH /api/v1/connections/:userId/accept
 * @desc Accept a connection request from a user
 * @access Private (requires authentication)
 */
router.patch("/:userId/accept", acceptConnectionRequest);

/**
 * @route PATCH /api/v1/connections/:userId/reject
 * @desc Reject a connection request from a user
 * @access Private (requires authentication)
 */
router.delete("/:userId/reject", rejectConnectionRequest);


export default router;