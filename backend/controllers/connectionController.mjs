import { Connection } from "../models/connectionModel.mjs";

export const getUserConnections = async (req, res) => {
    const userId = req.user._id;
    const limit = 20;
    const pageNumber = Number(req.query.page) || 1;

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
    const limit = 20;
    const pageNumber = Number(req.query.page) || 1;

    try {
        // Get total count of sent pending requests for pagination
        const totalPendingRequests = await Connection.countDocuments({
            sender: userId,
            status: "pending"
        })

        // Fetch paginated sent pending connection requests (sort by latest)
        const sentPendingRequests = await Connection.find({
            sender: userId,
            status: "pending"
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .populate("receiver", "name username profilePicture headline")
            .lean();

        // Extract only receiver details (since current user is the sender)
        const pendingRequests = sentPendingRequests.map(req => req.receiver);

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


export const sendConnectionRequest = async (req, res) => {
    const sender = req.user._id;
    const receiver = req.params.userId;

    try {

        // check if a connection request already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender } // prevent duplicated requests in reverse order
            ]
        }).lean();

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: "Connection request already exists"
            })
        }

        // create a new connection request 
        const newConnection = new Connection({
            sender,
            receiver,
            status: "pending"
        })
        await newConnection.save()

        res.status(200).json({
            success: true,
            message: "Connection request sent successfully",
            data: newConnection
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

    // TODO: send accept connection request email in parallel,
    // TODO: add notification requestAccepted in parallel
    // TODO: handle the request that is you send to yourself 
    // TODO: and if the request is already accepted (rejected deleted instantly)
    // TODO: an ideo comes to your mind, don't forget it: delete and performance
    try {

        const acceptedConnectionRequest = await Connection.findOneAndUpdate(
            {
                sender,
                receiver,
                status: "pending"
            },
            { $set: { status: "accepted" } },
            { new: true }
        )

        if (!acceptedConnectionRequest) {
            return res.status(404).json({
                success: false,
                message: "No Pending connection request found"
            })
        }

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