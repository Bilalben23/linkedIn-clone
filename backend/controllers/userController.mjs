import cloudinary from "../configs/cloudinary.mjs";
import { User } from "../models/userModel.mjs"
import { hashPassword } from "../utils/bcryptUtils.mjs";

export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        // find users who are not already connected, and also do not recommend our own profile.
        const suggestedUsers = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections
            }
        })
            .select("name username profilePicture headline")
            .limit(3)

        res.status(200).json({
            success: true,
            data: suggestedUsers
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const getPublicProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {

        const userId = req.user._id;
        const updates = { ...req.body };

        if (updates?.password) {
            updates.password = await hashPassword(updates?.password);
        }

        if (updates.profilePicture) {
            const result = await cloudinary.uploader.upload(updates.profilePicture)
            updates.profilePicture = result.secure_url;
        }

        if (updates.bannerImg) {
            const result = await cloudinary.uploader.upload(updates.bannerImg)
            updates.bannerImg = result.secure_url;
        }

        const updateUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updateUser
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}