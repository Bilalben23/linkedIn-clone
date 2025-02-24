import { Notification } from "../models/notificationModel.mjs"

export const getUserNotifications = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;
    const userId = req.user._id;

    try {
        const totalNotifications = await Notification.countDocuments({ recipient: userId });

        const paginatedNotifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limit)
            .limit(limit)
            .populate("triggeredBy -recipient", "name username profilePicture headline")
            .populate({
                path: "relatedPost",
                select: "content image",
                match: { _id: { $ne: null } }
            })
            .lean();

        const totalPages = Math.ceil(totalNotifications / limit);

        const pagination = {
            currentPage: pageNumber,
            totalNotifications,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
        }

        res.status(200).json({
            success: true,
            data: paginatedNotifications,
            pagination
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const getUnreadNotificationCount = async (req, res) => {
    const userId = req.user._id;
    try {
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            read: false
        });

        res.status(200).json({
            success: true,
            unreadCount
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    try {

        const updatedNotification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { $set: { read: true } },
            { new: true }
        )

        if (!updatedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or not authorized"
            })
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read successfully",
            data: updatedNotification
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}



export const markAllNotificationsAsRead = async (req, res) => {
    const userId = req.user._id;

    try {
        const result = await Notification.updateMany(
            { recipient: userId },
            { $set: { read: true } },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} Notification${result.modifiedCount !== 1 ? "s" : ""} marked as read successfully`,
            modifiedCount: result.modifiedCount
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    try {
        const deletedNotification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: userId
        })

        if (!deletedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or unauthorized"
            })
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
            data: deletedNotification
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const deleteAllNotifications = async (req, res) => {
    const userId = req.user._id;

    try {
        const result = await Notification.deleteMany({ recipient: userId });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notification${result.deletedCount !== 1 ? "s" : ""} deleted successfully`,
            deletedCount: result.deletedCount
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}