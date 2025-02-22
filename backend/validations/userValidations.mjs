import { checkSchema } from "express-validator";

export const updateProfileValidation = checkSchema({
    name: {
        in: "body",
        optional: true,
        trim: true,
        escape: true,
        isString: {
            errorMessage: "name mus be a string"
        },
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: "Name must be between 3 and 50 characters long"
        }
    },
    username: {
        in: "body",
        optional: true,
        trim: true,
        escape: true,
        toLowerCase: true,
        isAlphanumeric: {
            errorMessage: "Username can only contain letters and numbers",
        },
        isLength: {
            options: { min: 3, max: 25 },
            errorMessage: "Username must be between 3 and 25 characters long",
        }
    },
    email: {
        in: "body",
        optional: true,
        normalizeEmail: true,
        escape: true,
        isEmail: {
            errorMessage: "Email address is invalid"
        }
    },
    password: {
        in: "body",
        optional: true,
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long",
            bail: true
        },
        matches: {
            options: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            errorMessage: "Password must contain at least one letter, one number, and one special character",
        }
    },
    headline: {
        in: "body",
        optional: true,
        escape: true,
        trim: true,
        isString: {
            errorMessage: "Headline must be a string"
        },
        isLength: {
            options: { max: 100 },
            errorMessage: "Headline must not exceed 100 characters",
        }
    },
    location: {
        in: "body",
        optional: true,
        escape: true,
        trim: true,
        isString: {
            errorMessage: "Location must be a string"
        }
    },
    about: {
        in: "body",
        optional: true,
        trim: true,
        escape: true,
        isString: {
            errorMessage: "About section must be a string"
        },
        isLength: {
            options: { max: 500 },
            errorMessage: "About section must not exceed 500 characters",
        }
    },
    skills: {
        in: "body",
        optional: true,
        isArray: {
            errorMessage: "Skills must be an array"
        },
        custom: {
            options: (skills) => skills.every(skill => typeof skill === "string"),
            errorMessage: "Each skill must be a string"
        }
    },


    experiences: {
        in: "body",
        optional: true,
        isArray: {
            errorMessage: "Experiences must be an array"
        }
    },
    "experiences.*.title": {
        in: "body",
        trim: true,
        escape: true,
        isString: {
            errorMessage: "Experience title must be a string"
        },
        isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "Title must be between 2 and 100 characters"
        }
    },
    "experiences.*.company": {
        in: "body",
        optional: false,
        trim: true,
        isString: {
            errorMessage: "Company must be a string"
        },
        isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "Company name must be between 2 and 100 characters"
        }
    },
    "experiences.*.startDate": {
        in: "body",
        isISO8601: {
            errorMessage: "Start date must be a valid date (YYYY-MM-DD)"
        }
    },
    "experiences.*.endDate": {
        in: "body",
        isISO8601: {
            errorMessage: "End date must be a valid date (YYYY-MM-DD)"
        },
        custom: {
            options: (value, { req, path }) => {
                const index = path.match(/\d+/)[0]; // Extract index from "experiences.[index].endDate"
                const startDate = req.body.experiences[index]?.startDate;
                if (startDate && new Date(value) < new Date(startDate)) {
                    throw new Error("End date cannot be earlier than start date");
                }
                return true;
            }
        }
    }


    ,
    education: {
        in: "body",
        optional: true,
        isArray: {
            errorMessage: "Education must be an array"
        }
    },
    "education.*.school": {
        in: "body",
        isString: {
            errorMessage: "School name must be a string"
        },
        isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "School name must be between 2 and 100 characters"
        }
    },
    "education.*.fieldOfStudy": {
        in: "body",
        isString: {
            errorMessage: "Field of study must be a string"
        },
        isLength: {
            options: { min: 2, max: 100 },
            errorMessage: "Field of study must be between 2 and 100 characters"
        }
    },
    "education.*.startYear": {
        in: ["body"],
        optional: false,
        isInt: {
            options: {
                min: 1900,
                max: new Date().getFullYear()
            },
            errorMessage: "Start year must be a valid year"
        }
    },
    "education.*.endYear": {
        in: ["body"],
        optional: true,
        isInt: {
            options: {
                min: 1900,
                max: new Date().getFullYear()
            },
            errorMessage: "End year must be a valid year"
        },
        custom: {
            options: (value, { req, path }) => {
                const index = path.match(/\d+/)[0]; // Extract index from "education.[index].endYear"
                const startYear = req.body.education[index]?.startYear;
                if (startYear && value < startYear) {
                    throw new Error("End year cannot be earlier than start year");
                }
                return true;
            }
        }
    }
})

export const validateGetPublicProfile = checkSchema({
    username: {
        in: "params",
        toLowerCase: true,
        trim: true,
        notEmpty: {
            errorMessage: "Username param is required"
        },
        isAlphanumeric: {
            errorMessage: "Username param can only contain letters and numbers"
        }
    }
})