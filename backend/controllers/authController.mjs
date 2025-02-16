import { sendWelcomeEmail } from "../emails/sendWelcomeEmail.mjs";
import { User } from "../models/userModel.mjs";
import { hashPassword } from "../utils/bcrypt.mjs";

export const signin = (req, res) => {
    try {


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const signup = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const doesExist = await User.findOne({ $or: [{ email }, { username }] }, "username email");

        if (doesExist) {
            return res.status(409).json({
                success: false,
                message: doesExist.email === email ? "Email already exists" : "Username already exists",
                errors: [
                    {
                        field: doesExist.email === email ? "email" : "username",
                        msg: doesExist.email === email ? "Email already exists" : "Username already exists"
                    }
                ]
            })
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        // Sending a welcome email to the user
        const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`
        try {
            await sendWelcomeEmail(user.email, user.username, profileUrl);
        } catch (err) {
            console.error("Error sending welcome email: " + err.message)
        }

        res.status(200).json({
            success: true,
            message: "User registered successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const logout = (req, res) => {
    try {



    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const getCurrentUser = async (req, res) => {
    try {




    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}