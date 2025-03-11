import cloudinary from "../configs/cloudinary.mjs";
import { Connection } from "../models/connectionModel.mjs";
import { Post } from "../models/postModel.mjs";
import { User } from "../models/userModel.mjs"
import { hashPassword } from "../utils/bcryptUtils.mjs";
import { uploadImage } from "../utils/uploadImage.mjs";


export const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const updates = { ...req.body };
    const timestamp = Date.now();

    try {

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        // upload profile picture
        if (req.files?.profilePicture) {
            try {

                const profilePictureName = `profile_${req.user._id}_${timestamp}`;
                const newProfilePicture = await uploadImage(
                    req.files.profilePicture,
                    "linkedin/profile_pictures",
                    profilePictureName
                )

                // if upload successful, delete old profile picture
                if (req.user.profilePicture) {
                    await cloudinary.uploader.destroy(req.user.profilePicture);
                }

                updates.profilePicture = newProfilePicture;
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Profile picture upload failed",
                    error: err.message
                })
            }
        }

        // upload banner image
        if (req.files?.bannerImg) {
            try {

                const bannerName = `banner_${req.user._id}_${timestamp}`
                const newBannerImg = await uploadImage(
                    req.files.bannerImg,
                    "linkedin/banner_images",
                    bannerName
                );
                // if upload successful, delete old banner image
                if (req.user.bannerImg) {
                    await cloudinary.uploader.destroy(req.user.bannerImg);
                }
                updates.bannerImg = newBannerImg;
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Banner image upload failed",
                    error: err.message
                })
            }
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        ).select("-password");

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
    let deleteOperations = [];

    try {

        // delete the profile picture from cloudinary (if exists)
        if (req.user.profilePicture) {
            deleteOperations.push(
                cloudinary.uploader.destroy(req.user.profilePicture)
            );
        }

        // delete the banner image from cloudinary (if it exists)
        if (req.user.bannerImg) {
            deleteOperations.push(
                cloudinary.uploader.destroy(req.user.bannerImg)
            );
        }

        const results = await Promise.allSettled(deleteOperations);

        results.forEach((result, index) => {
            if (result.status === "rejected") {
                console.error(`Failed to delete ${index === 0 ? "profile picture" : "banner image"}:`, result.reason);
            }
        });

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
    const limit = req.query.limit || 4;
    const userId = req.user._id;

    try {
        // Get user connections (users already connected or the request is pending with the current user)
        const userConnections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .select("sender receiver")
            .lean();

        // Extract only user IDs from connections
        const connectedUserIds = userConnections.flatMap(conn => [conn.sender.toString(), conn.receiver.toString()])

        // Find users who are NOT already connected and exclude the current user
        const suggestedUsers = await User.find({
            _id: {
                $nin: [...connectedUserIds, userId]
            }
        })
            .select("name username profilePicture bannerImg headline")
            .limit(limit)
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
            .select("-password -__v")
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const [posts, connectionsCount] = await Promise.all([
            Post.find({ author: user._id })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            Connection.countDocuments({
                $or: [
                    { sender: user._id },
                    { receiver: user._id }
                ],
                status: "accepted"
            })
        ])

        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: {
                user,
                posts,
                connectionsCount
            }
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}