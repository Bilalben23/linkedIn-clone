import { Router } from "express";
import {
    validateDeleteNotification,
    validateGetUserNotifications,
    validateMarkNotificationAsRead
} from "../validations/notificationValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllNotifications
} from "../controllers/notificationController.mjs"


const router = Router();

/**
 * @route /api/v1/notifications
 * @desc Get latest paginated notifications for the authenticated user.
 * @access Private (requires authentication)
 */
router.get("/", validateGetUserNotifications, validateRequest, getUserNotifications);

/**
 * @route PATCH /api/v1/notifications/:notificationId
 * @desc Mark a specific notification as read
 * @access Private (requires authentication)
 */
router.patch("/:notificationId/read", validateMarkNotificationAsRead, validateRequest, markNotificationAsRead);

/**
 * @route PATCH /api/v1/notifications/read-all
 * @desc Mark all notifications as read for the authenticated user 
 * @access Private (requires authentication)
 */
router.patch("/read-all", markAllNotificationsAsRead);

/**
 * @route DELETE /api/v1/notifications/:notificationId
 * @desc Delete a specific notification
 * @access Private (requires authentication)
 */
router.delete("/:notificationId", validateDeleteNotification, validateRequest, deleteNotification);

/**
 * DELETE /api/v1/notifications
 * @desc Delete all notifications for the authenticated user
 * @access Private (requires authentication)
 */
router.delete("/", deleteAllNotifications);

export default router;