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
        optional: true,
        toInt: true,
        isInt: {
            options: { min: 1 },
            errorMessage: "Page must be a positive integer",
        },
        default: { options: 1 },
    },
};

const typeValidation = {
    type: {
        in: "body",
        trim: true,
        toLowerCase: true,
        notEmpty: {
            errorMessage: "Reaction type cannot be empty",
        },
        isIn: {
            options: [["like", "celebrate", "support", "love", "insightful", "funny"]],
            errorMessage: "Invalid reaction type. Choose from: like, celebrate, support, love, insightful, or funny."
        }
    }
}

export const validateGetPostReactions = checkSchema({ ...postIdValidation, ...pageValidation });
export const validateToggleReaction = checkSchema({ ...postIdValidation, ...typeValidation });
