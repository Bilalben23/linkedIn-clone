import { Comment } from "../models/commentModel.mjs";
import { Notification } from "../models/notificationModel.mjs";
import { Post } from "../models/postModel.mjs";

export const getPostComments = async (req, res) => {
    const pageNumber = Math.max(1, Number(req.query.page) || 1);
    const limit = 4;
    const { postId } = req.params;

    try {

        // First, count total comments (faster than fetching everything)
        const totalComments = await Comment.countDocuments({ post: postId });
        const totalPages = Math.ceil(totalComments / limit);

        // If no comments and requesting page 1, check if the post exists
        if (totalComments === 0 && pageNumber === 1) {
            const postExists = await Post.exists({ _id: postId });

            if (!postExists) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found"
                })
            }
        }

        const pagination = {
            currentPage: pageNumber,
            totalComments,
            totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
        }

        // if the request page is beyond available pages, return an empty array
        if (pageNumber > totalPages) {
            return res.status(200).json({
                success: true,
                data: [],
                pagination
            })
        }

        // fetch paginated comments
        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limit)
            .limit(limit)
            .populate("user", "name username profilePicture headline")
            .populate("post", "author")
            .lean();

        res.status(200).json({
            success: true,
            data: comments,
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


export const commentOnPost = async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;
    const { content } = req.body;

    try {
        const post = await Post.findById(postId).lean();
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const newComment = new Comment({
            user: userId,
            content,
            post: postId
        })
        await newComment.save();

        // only create a notification if the commenter is not the post owner 
        if (userId.toString() !== post.author.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                triggeredBy: userId,
                relatedPost: postId
            })
            await newNotification.save();
        }

        res.status(201).json({
            success: true,
            message: "Comment Added successfully",
            data: newComment
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    try {

        const comment = await Comment.findById(commentId).lean();
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            })
        }

        if (userId.toString() !== comment.user.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are unauthorized to update this comment"
            })
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $set: { content } },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: updatedComment
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id.toString();

    try {

        const comment = await Comment.findById(commentId)
            .populate("post", "author")

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        }

        // check if the user is either the comment user or the post user
        if (userId !== comment.user.toString() && userId !== comment.post.author.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are unauthorized to delete this comment"
            })
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
} 