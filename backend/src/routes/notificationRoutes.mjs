import { Router } from "express";
import * as NotificationValidation  from "../validations/notificationValidations.mjs";
import { validateRequest } from "../middlewares/validateRequest.mjs";
import * as NotificationController from "../controllers/notificationController.mjs";


const router = Router();


/**
 * @route /api/v1/notifications
 * @desc Get latest paginated notifications for the authenticated user.
 * @access Private (requires authentication)
 */
router.get(
    "/",
    NotificationValidation.validateGetUserNotifications,
    validateRequest,
    NotificationController.getUserNotifications
);


/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get the count of unread notifications for the authenticated user
 * @access Private (requires authentication)
 */
router.get(
    "/unread-count", 
    NotificationController.getUnreadNotificationCount
);


/**
 * @route PATCH /api/v1/notifications/:notificationId
 * @desc Mark a specific notification as read
 * @access Private (requires authentication)
 */
router.patch(
    "/:notificationId/read", 
    NotificationValidation.validateMarkNotificationAsRead, 
    validateRequest,
    NotificationController.markNotificationAsRead
);


/**
 * @route DELETE /api/v1/notifications/:notificationId
 * @desc Delete a specific notification
 * @access Private (requires authentication)
 */
router.delete(
    "/:notificationId",
    NotificationValidation.validateDeleteNotification,
    validateRequest, 
    NotificationController.deleteNotification
);


export default router;