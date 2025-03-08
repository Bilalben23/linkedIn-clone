import { Connection } from "../models/connectionModel.mjs";
import { Notification } from "../models/notificationModel.mjs";

export const getUserConnections = async (req, res) => {
    const userId = req.user._id;
    const limit = 20;
    const pageNumber = Math.max(1, Number(req.query.page) || 1);

    try {
        // Get total connections count for pagination
        const totalConnections = await Connection.countDocuments({
            $or: [{ sender: userId }, { receiver: userId }],
            status: "accepted"
        })

        // Fetch paginated connections (sort by latest updates)
        const userConnections = await Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: "accepted"
        })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .populate("sender receiver", "name username profilePicture headline")
            .lean();

        // Format response data: Exclude the current user from each connection
        const connectedUsers = userConnections.map(conn => conn.sender._id.toString() === userId.toString() ? conn.receiver : conn.sender);

        // pagination object
        const totalPages = Math.ceil(totalConnections / limit);
        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalConnections,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }

        res.status(200).json({
            success: true,
            message: "User connections retrieved successfully",
            data: connectedUsers,
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


export const getPendingRequests = async (req, res) => {
    const userId = req.user._id;
    const limit = 6;
    const pageNumber = Number(req.query.page) || 1;

    try {
        // Get total count of sent pending requests for pagination
        const totalPendingRequests = await Connection.countDocuments({
            receiver: userId,
            status: "pending"
        })

        // Fetch paginated sent pending connection requests (sort by latest)
        const sentPendingRequests = await Connection.find({
            receiver: userId,
            status: "pending"
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .populate("sender", "name username profilePicture headline")
            .lean();

        // Extract only sender details (since current user is the receiver)
        const pendingRequests = sentPendingRequests.map(req => req.sender);

        // pagination object
        const totalPages = Math.ceil(totalPendingRequests / limit);
        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalPendingRequests,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }

        res.status(200).json({
            success: true,
            message: "User Pending Connections retrieved successfully",
            data: pendingRequests,
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

export const getPendingRequestsCount = async (req, res) => {
    const userId = req.user._id;
    try {
        const pendingRequestsCount = await Connection.countDocuments({
            receiver: userId,
            status: "pending"
        })

        res.status(200).json({
            success: true,
            pendingRequestsCount
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const toggleConnectionRequest = async (req, res) => {
    const sender = req.user._id;
    const receiver = req.params.userId;

    try {

        // prevent sending the request to myself
        if (sender.toString() === receiver.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a connection request to yourself"
            })
        }

        // check if a connection request already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender } // prevent duplicated requests in reverse order
            ]
        }).lean();

        if (existingConnection) {
            // If it exists, remove the connection request (toggle off)
            await Connection.findByIdAndDelete(existingConnection._id);
            return res.status(200).json({
                success: true,
                isConnected: false,
                message: "Connection request withdrew successfully",
            });
        }

        // if doesn't exist, create a new connection request (toggle on)
        const newConnection = new Connection({
            sender,
            receiver,
            status: "pending"
        })
        await newConnection.save()

        res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            isConnected: true
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const acceptConnectionRequest = async (req, res) => {
    const receiver = req.user._id;
    const sender = req.params.userId;

    try {
        const acceptedConnectionRequest = await Connection.findOneAndUpdate({
            sender,
            receiver,
            status: "pending"
        },
            {
                $set: {
                    status: "accepted"
                }
            },
            { new: true }
        );

        if (!acceptedConnectionRequest) {
            return res.status(404).json({
                success: false,
                message: "No Pending connection request found"
            })
        }

        Notification.create({
            receiver: sender,
            triggeredBy: receiver,
            type: "connectionAccepted"
        }).catch(err => {
            console.error("Notification failed:", err.message);
        })


        res.status(200).json({
            success: true,
            message: "Connection request accepted successfully",
            data: acceptedConnectionRequest
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

export const rejectConnectionRequest = async (req, res) => {
    const receiver = req.user._id;
    const sender = req.params.userId;

    try {
        const declinedConnectionRequest = await Connection.findOneAndDelete(
            {
                sender,
                receiver,
                status: "pending"
            }
        )

        if (!declinedConnectionRequest) {
            console.log("Connection not found")
            return res.status(404).json({
                success: false,
                message: "No Pending connection request found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Connection request rejected successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}