import { Like } from "../models/likeModel.mjs";
import { Notification } from "../models/notificationModel.mjs"
import { Post } from "../models/postModel.mjs";


export const getPostLikes = async (req, res) => {
    const { postId } = req.params;
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;

    try {
        const likes = await Like.find({ post: postId })
            .populate("user", "name username profilePicture headline")
            .skip((pageNumber - 1) * limit)
            .limit(limit)
            .lean();

        const totalLikes = await Like.countDocuments({ post: postId });
        const totalPages = Math.ceil(totalLikes / limit);

        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalLikes,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }

        res.status(200).json({
            success: true,
            data: likes,
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


export const toggleLikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {

        // Fetch the post to get its author 
        const post = await Post.findById(postId).select("author").lean();
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // try to delete the like if it exists (unlike)
        const like = await Like.findOneAndDelete({
            user: userId,
            post: postId
        })

        if (like) {
            // Attempt to remove the notification in parallel, and don't break if it fails
            Notification.deleteOne({
                recipient: post.author,
                type: "like",
                triggeredBy: userId,
                relatedPost: postId
            }).catch((err) => console.error("Error deleting like notification:", err.message));


            return res.status(200).json({
                success: true,
                message: "Post unliked successfully"
            })
        }

        // if no like exists, create a new one (Like)
        await Like.create({ post: postId, user: userId });

        // Add like notification in parallel(non-blocking) and only if the liker is not the post author
        if (post.author.toString() !== userId.toString()) {
            Notification.create({
                recipient: post.author,
                type: "like",
                triggeredBy: userId,
                relatedPost: postId
            }).catch((err) => console.error("Error adding like notification:", err.message));
        }

        res.status(201).json({
            success: true,
            message: "Post liked successfully"
        })

    } catch (err) {
        console.error("Error in toggleLikePost:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}
