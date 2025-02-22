import { checkSchema } from "express-validator";

const pageValidation = checkSchema({
    page: {
        in: "query",
        toInt: true,
        isInt: { options: { min: 1 }, errorMessage: "Page must be a positive integer" },
        default: { options: 1 }
    }
});

const userIdValidation = checkSchema({
    userId: {
        in: "params",
        isMongoId: { errorMessage: "Invalid user ID format" }
    }
});

export const validateGetUserConnections = pageValidation;
export const validateGetPendingRequests = pageValidation;
export const validateSendConnectionRequest = userIdValidation;
export const validateAcceptConnectionRequest = userIdValidation;
export const validateRejectConnectionRequest = userIdValidation;
