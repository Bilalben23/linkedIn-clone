import { checkSchema } from "express-validator";

const postIdValidation = checkSchema({
    postId: {
        in: "params",
        isMongoId: {
            errorMessage: "Invalid post ID format",
        },
    },
});

const pageValidation = checkSchema({
    page: {
        in: "query",
        toInt: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "Page must be a positive integer",
        },
        default: { options: 1 },
    },
});

const createPostValidation = checkSchema({
    content: {
        in: "body",
        optional: true,
        trim: true,
        isLength: {
            options: { min: 1 },
            errorMessage: "Content must not be empty if provided.",
        },
    },
    image: {
        optional: true,
        custom: {
            options: (value, { req }) => {
                if (!req.files || !req.files.image) return true; // Image is optional
                const file = req.files.image;
                if (!file.mimetype.startsWith("image/")) {
                    throw new Error("Only image files are allowed.");
                }
                if (file.size > 5 * 1024 * 1024) { // Max 5MB
                    throw new Error("Image size must not exceed 5MB.");
                }
                return true;
            },
        },
    },
    postValidation: {
        custom: {
            options: (_, { req }) => {
                if (!req.body.content && (!req.files || !req.files.image)) {
                    throw new Error("Post must contain either text or an image.");
                }
                return true;
            },
        },
    },
});

const updatePostValidation = checkSchema({
    content: {
        in: "body",
        optional: true,
        trim: true,
        isLength: {
            options: { min: 1 },
            errorMessage: "Content must not be empty if provided.",
        },
    },
    image: {
        optional: true,
        custom: {
            options: (value, { req }) => {
                if (!req.files || !req.files.image) return true; // Image is optional
                const file = req.files.image;
                if (!file.mimetype.startsWith("image/")) {
                    throw new Error("Only image files are allowed.");
                }
                if (file.size > 5 * 1024 * 1024) { // Max 5MB
                    throw new Error("Image size must not exceed 5MB.");
                }
                return true;
            },
        },
    },
    updateValidation: {
        custom: {
            options: (_, { req }) => {
                if (!req.body.content && (!req.files || !req.files.image)) {
                    throw new Error("Update must contain either text or an image.");
                }
                return true;
            },
        },
    },
});

export const validateGetFeedPosts = pageValidation;
export const validateGetPostById = postIdValidation;
export const validateCreatePost = createPostValidation;
export const validateUpdatePost = [postIdValidation, updatePostValidation];
export const validateDeletePost = postIdValidation;
