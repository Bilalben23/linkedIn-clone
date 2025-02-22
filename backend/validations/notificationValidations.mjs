import { checkSchema } from "express-validator";

const notificationIdValidation = checkSchema({
    notificationId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid notification ID format",
        },
    },
});

const pageValidation = checkSchema({
    page: {
        in: "query",
        toInt: true,
        isInt: {
            options: {
                min: 1
            },
            errorMessage: "Page must be a positive integer",
        },
        default: { options: 1 },
    },
});

export const validateGetUserNotifications = pageValidation;
export const validateMarkNotificationAsRead = notificationIdValidation;
export const validateDeleteNotification = notificationIdValidation;

