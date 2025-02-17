import { sendWelcomeEmail } from "../emails/sendWelcomeEmail.mjs";
import { User } from "../models/userModel.mjs";
import { hashPassword } from "../utils/bcryptUtils.mjs";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils.mjs";
import jwt from "jsonwebtoken";


export const signin = async (req, res) => {
    const { username, password, rememberMe = false } = req.body;

    try {
        const user = await User.findOne({ username }).select("name username email password headline profilePicture");

        if (!user || !(await compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Credentials"
            })
        }

        // generate access token and refresh token
        const accessToken = generateAccessToken({ id: user._id, username: user.username, email: user.email });
        const refreshToken = generateRefreshToken({ id: user._id }, rememberMe);


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24 * 7
        })


        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            },
            accessToken
        })

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

        // Sending a welcome email to the registered user
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


export const refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: "Refresh token is missing"
        })
    }

    try {

        jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token"
                })
            }
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            const newAccessToken = generateAccessToken({ id: user._id, username: user.username, email: user.email });

            res.status(200).json({
                success: true,
                message: "New Access Token generated successfully",
                user: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture
                },
                accessToken: newAccessToken
            })
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const logout = (req, res) => {
    const refreshToken = req.cookie.refreshToken;

    try {

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No active session found, user is already logged out"
            })
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        })

        res.status(200).json({
            success: true,
            message: "Logout successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const getCurrentUser = async (req, res) => {
    console.log(req.user);
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}