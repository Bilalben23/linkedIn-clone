import { Router } from "express";
import {
    validateDeleteNotification,
    validateGetUserNotifications,
    validateMarkNotificationAsRead
} from "../validations/notificationValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import {
    getUnreadNotificationCount,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notificationController.mjs"


const router = Router();

/**
 * @route /api/v1/notifications
 * @desc Get latest paginated notifications for the authenticated user.
 * @access Private (requires authentication)
 */
router.get("/", validateGetUserNotifications, validateRequest, getUserNotifications);


/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get the count of unread notifications for the authenticated user
 * @access Private (requires authentication)
 */
router.get("/unread-count", getUnreadNotificationCount);


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
router.patch("/mark-all-read", markAllNotificationsAsRead);

/**
 * @route DELETE /api/v1/notifications/:notificationId
 * @desc Delete a specific notification
 * @access Private (requires authentication)
 */
router.delete("/:notificationId", validateDeleteNotification, validateRequest, deleteNotification);

export default router;