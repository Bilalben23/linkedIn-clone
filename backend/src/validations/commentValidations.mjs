import { checkSchema } from "express-validator";


const postIdValidation = {
    postId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid post ID format",
        },
    },
};


const commentIdValidation = {
    commentId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid comment ID format",
        },
    },
};


const pageValidation = {
    page: {
        in: "query",
        optional: true,
        toInt: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "Page must be a positive integer",
        },
        default: { options: 1 },
    },
};


const createCommentValidation = {
    ...postIdValidation,
    content: {
        in: "body",
        escape: true,
        trim: true,
        notEmpty: {
            errorMessage: "Comment content cannot be empty",
        },
        isLength: {
            options: { min: 1, max: 1000 },
            errorMessage: "Comment must be between 1 and 1000 characters",
        },
    },
};


const updateCommentValidation = {
    ...commentIdValidation,
    content: {
        in: "body",
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "Updated comment content cannot be empty",
        },
        isLength: {
            options: { min: 1, max: 1000 },
            errorMessage: "Updated comment must be between 1 and 1000 characters",
        }
    },
};

export const validateGetPostComments = checkSchema({ ...postIdValidation, ...pageValidation });
export const validateCommentOnPost = checkSchema(createCommentValidation);
export const validateUpdateComment = checkSchema(updateCommentValidation);
export const validateDeleteComment = checkSchema(commentIdValidation);
