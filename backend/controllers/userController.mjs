import cloudinary from "../configs/cloudinary.mjs";
import { Connection } from "../models/connectionModel.mjs";
import { User } from "../models/userModel.mjs"
import { hashPassword } from "../utils/bcryptUtils.mjs";




export const updateProfile = async (req, res) => {
    try {

        const userId = req.user._id;
        const updates = { ...req.body };

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        // handle profile picture update
        if (updates.profilePicture) {

            // delete the old profile picture if does exist
            if (req.user.profilePicture) {
                try {
                    await cloudinary.uploader.destroy(req.user.profilePicture);
                } catch (deleteErr) {
                    console.error("Error deleting old profile picture:", deleteErr.message);
                }
            }
            try {
                const result = await cloudinary.uploader.upload(updates.profilePicture, {
                    folder: "linkedin_profile_pictures",
                    public_id: `linkedin_profile_${userId}`,
                    overwrite: true
                })
                updates.profilePicture = result.public_id;
            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Upload profile picture failed"
                })
            }
        }

        // handle banner image update
        if (updates.bannerImg) {
            // delete the old banner image if does exist
            try {
                await cloudinary.uploader.destroy(req.user.bannerImg);
            } catch (deleteErr) {
                console.error("Error deleting old banner image:", deleteErr.message);
            }

            try {
                const result = await cloudinary.uploader.upload(updates.bannerImg, {
                    folder: "linkedIn_banner_images",
                    public_id: `linkedIn_banner_${userId}`,
                    overwrite: true
                })
                updates.bannerImg = result.public_id;
            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Upload banner image failed"
                })
            }
        }

        const updateUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updateUser
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

export const deleteAccount = async (req, res) => {
    const userId = req.user._id;

    try {

        // delete the profile picture from cloudinary (if exists)

        if (req.user.profilePicture) {
            try {
                await cloudinary.uploader.destroy(req.user.profilePicture);
            } catch (err) {
                console.error("Failed to delete profile picture:", err.message);
            }
        }

        // delete the banner image from cloudinary (if it exists)
        if (req.user.bannerImg) {
            try {
                await cloudinary.uploader.destroy(req.user.bannerImg);
            } catch (err) {
                console.error("Failed to delete banner image:", err.message);
            }
        }

        // delete the user (Mongoose middleware will handle cascading deletes)
        await User.deleteOne({ _id: userId });

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const getSuggestedConnections = async (req, res) => {
    const userId = req.user._id;

    try {
        // Get accepted connections (users already connected with the current user)
        const userConnections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: "accepted"
        })
            .select("sender receiver")
            .lean();

        // Extract only user IDs from connections
        const connectedUserIds = userConnections.flatMap(conn => [conn.sender.toString, conn.receiver.toString])

        // Find users who are NOT already connected and exclude the current user
        const suggestedUsers = await User.find({
            _id: {
                $nin: [...connectedUserIds, userId]
            }
        })
            .select("name username profilePicture headline")
            .limit(3)
            .lean()

        res.status(200).json({
            success: true,
            message: "Suggested connections retrieved successfully",
            data: suggestedUsers
        })

    } catch (err) {
        console.error("Error fetching suggested connections:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

export const searchUsers = async (res, req) => {
    try {

        // TODO: DO this later, don't forget it! 
        res.status(200).json({
            success: true,
            message: "Do this later, don't forget it!"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const getPublicProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username })
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}