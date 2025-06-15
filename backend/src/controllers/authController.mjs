import { sendWelcomeEmail } from "../emails/sendWelcomeEmail.mjs";
import { User } from "../models/userModel.mjs";
import { hashPassword } from "../utils/bcryptUtils.mjs";
import { compare } from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtils.mjs";
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../configs/enVars.mjs";


export const signup = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
            .select("username email")
            .lean();

        if (existingUser) {
            const field = existingUser.email === email ? "email" : "username";

            return res.status(409).json({
                success: false,
                message: `${field === "email" ? "Email" : "Username"} already exists`,
                errors: [
                    {
                        field,
                        msg: `${field === "email" ? "Email" : "Username"} already`
                    }
                ]
            })
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()

        // send welcome email asynchronously to the new register user
        const profileUrl = `${ENV_VARS.CLIENT_URL}/profile/${newUser.username}`
        sendWelcomeEmail(newUser.email, newUser.username, profileUrl)
            .catch(err => console.error("Error sending welcome email:", err.message));

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        })

    } catch (err) {
        console.log("Sign up error: " + err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const signin = async (req, res) => {
    const { email, password, rememberMe = false } = req.body;

    try {
        // Allow login with either username or email
        const user = await User.findOne({ email })
            .select("name username password profilePicture bannerImg headline location")
            .lean();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Credentials",
                errors: []
            })
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Credentials",
                errors: []
            })
        }

        // generate tokens
        const accessToken = generateAccessToken({ id: user._id, username: user.username });
        const refreshToken = generateRefreshToken({ id: user._id }, rememberMe);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENV_VARS.NODE_ENV === "production",
            sameSite: ENV_VARS.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24 * 7
        })

        res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                profilePicture: user.profilePicture,
                bannerImg: user.bannerImg,
                headline: user.headline,
                location: user.location
            },
            accessToken
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({
            success: false,
            message: "Refresh token is missing"
        });
    }

    try {
        jwt.verify(refreshToken, ENV_VARS.SECRET_REFRESH_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            }

            try {
                const user = await User.findById(decoded.id)
                    .select("name username profilePicture bannerImg headline location")
                    .lean();

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                const newAccessToken = generateAccessToken({ id: user._id, username: user.username });

                res.status(200).json({
                    success: true,
                    message: "New Access Token generated successfully",
                    user: {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        profilePicture: user.profilePicture,
                        bannerImg: user.bannerImg,
                        headline: user.headline,
                        location: user.location
                    },
                    accessToken: newAccessToken
                });

            } catch (err) {
                console.error("Error fetching user:", err.message);
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error",
                    error: err.message
                });
            }
        });

    } catch (err) {
        console.error("Server error in refreshToken:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


export const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: "No active session found, user is already logged out"
        })
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: ENV_VARS.NODE_ENV === "production",
        sameSite: ENV_VARS.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    })

    res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
}