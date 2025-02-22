import { checkSchema } from "express-validator";

const postIdValidation = {
    postId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid post ID format",
        },
    },
};

const pageValidation = {
    page: {
        in: "query",
        optional: true, // Page is optional, default is 1
        toInt: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "Page must be a positive integer",
        },
        default: { options: 1 },
    },
};

export const validateGetPostLikes = checkSchema({ ...postIdValidation, ...pageValidation });
export const validateToggleLikePost = checkSchema(postIdValidation);
