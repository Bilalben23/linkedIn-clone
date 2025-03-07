import { Notification } from "../models/notificationModel.mjs";


export const getUserNotifications = async (req, res) => {
    try {
        const pageNumber = Number(req.query?.page) || 1;
        const { filter } = req.query;
        const limit = 8;
        const userId = req.user._id;

        let filterTypes = [];
        if (filter === "all") {
            filterTypes = ["reaction", "comment", "newPost"];
        } else if (filter === "my_posts_all") {
            filterTypes = ["reaction", "comment"];
        } else if (filter === "connection_accepted") {
            filterTypes = ["connectionAccepted"];
        } else {
            filterTypes = ["reaction", "comment", "newPost", "connectionAccepted"];
        }

        const totalNotifications = await Notification.countDocuments({
            recipient: userId,
            type: { $in: filterTypes }
        });

        const paginatedNotifications = await Notification.aggregate([
            { $match: { recipient: userId, type: { $in: filterTypes } } },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    let: { triggeredById: "$triggeredBy" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$triggeredById"] } } },
                        {
                            $project: {
                                name: 1,
                                username: 1,
                                headline: 1,
                                profilePicture: 1
                            }
                        }
                    ],
                    as: "triggeredBy"
                }
            },
            { $unwind: "$triggeredBy" },
            {
                $lookup: {
                    from: "posts",
                    localField: "relatedPost",
                    foreignField: "_id",
                    as: "relatedPost"
                }
            },
            { $unwind: { path: "$relatedPost", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "comments",
                    localField: "relatedPost._id",
                    foreignField: "post",
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "reactions",
                    localField: "relatedPost._id",
                    foreignField: "post",
                    as: "reactions"
                }
            },
            {
                $addFields: {
                    commentsCount: { $size: "$comments" },
                    reactionsCount: { $size: "$reactions" }
                }
            },
            {
                $project: {
                    recipient: 0,
                    comments: 0,
                    reactions: 0
                }
            }
        ]);

        const totalPages = Math.ceil(totalNotifications / limit);

        const pagination = {
            currentPage: pageNumber,
            totalNotifications,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
        };

        res.status(200).json({
            success: true,
            data: paginatedNotifications,
            pagination
        });

    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


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