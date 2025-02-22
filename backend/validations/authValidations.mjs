import { checkSchema } from "express-validator";

export const signupValidation = checkSchema({
    name: {
        in: "body",
        trim: true,
        escape: true,
        isString: {
            errorMessage: "Name must be a string"
        },
        notEmpty: {
            errorMessage: "Name is required"
        },
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: "Name must be between 3 and 50 characters long"
        }
    },
    username: {
        in: "body",
        trim: true,
        toLowerCase: true,
        escape: true,
        notEmpty: {
            errorMessage: "Username is required"
        },
        isAlphanumeric: {
            errorMessage: "Username can only contain letters and numbers"
        },
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: "Username must be between 3 and 25 characters long"
        }
    },
    email: {
        in: "body",
        normalizeEmail: true,
        escape: true,
        notEmpty: {
            errorMessage: "Email address is required"
        },
        isEmail: {
            errorMessage: "Email address is invalid"
        }
    },
    password: {
        in: "body",
        trim: true,
        notEmpty: {
            errorMessage: "Password is required"
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long",
            bail: true,
        },
        matches: {
            options: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            errorMessage: "Password must contain at least one letter, one number, and one special character"
        }
    }
})


export const signinValidation = checkSchema({
    username: {
        in: "body",
        trim: true,
        toLowerCase: true,
        escape: true,
        notEmpty: {
            errorMessage: "Username is required"
        }
    }, password: {
        in: "body",
        trim: true,
        escape: true,
        notEmpty: {
            errorMessage: "Password is required"
        }

    }, rememberMe: {
        in: "body",
        toBoolean: true,
        optional: true,
        default: {
            options: false
        }
    }
})

