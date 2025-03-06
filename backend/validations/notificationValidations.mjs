import { checkSchema } from "express-validator";

const notificationIdValidation = {
    notificationId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid notification ID format",
        },
    },
};

const pageValidation = {
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
};

const filterValidation = {
    filter: {
        in: "query",
        isString: {
            errorMessage: "Filter query must be a string"
        },
        optional: true,
        isIn: {
            options: [['all', 'my_posts_all', 'connection_accepted']],
            errorMessage: 'Filter must be one of "all", "my_posts_all", or "connection_accepted"',
        }
    }
}

export const validateGetUserNotifications = checkSchema({ ...pageValidation, ...filterValidation });
export const validateMarkNotificationAsRead = checkSchema(notificationIdValidation);
export const validateDeleteNotification = checkSchema(notificationIdValidation);

