import * as Yup from "yup";

export const signupValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must not exceed 50 characters long")
        .required("Name is required"),
    username: Yup.string()
        .min(3, "username must be at least 3 characters long")
        .max(50, "Username must not exceed 50 characters long")
        .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
        .required("Username is required"),
    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email address is required"),
    password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password must have at least 1 letter, 1 number & 1 special character"
        )
})


export const signinValidationSchema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email address is required"),
    password: Yup.string()
        .trim()
        .required("Password is required"),
    rememberMe: Yup.boolean()
        .default(false)
})