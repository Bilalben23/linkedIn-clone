import { Reaction } from "../models/reactionModel.mjs";
import { Notification } from "../models/notificationModel.mjs"
import { Post } from "../models/postModel.mjs";


export const getPostReactions = async (req, res) => {
    const { postId } = req.params;
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;

    // TODO: feature improvement: improve performance by using cursor instead of using traditional pagination.

    try {
        // check if post exists before querying reactions
        const postExists = await Post.exists({ _id: postId });
        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // Fetch reactions and total count in parallel
        const [reactions, totalReactions] = await Promise.all([
            Reaction.find({ post: postId })
                .populate("user", "name username profilePicture headline")
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * limit)
                .limit(limit)
                .lean(),
            Reaction.countDocuments({ post: postId })
        ])

        const totalPages = Math.ceil(totalReactions / limit);

        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalReactions,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
        }

        res.status(200).json({
            success: true,
            data: reactions,
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


export const toggleReaction = async (req, res) => {
    const { type } = req.body;
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

        // check if the user has already reacted to the post
        const existingReaction = await Reaction.findOne({
            user: userId,
            post: postId
        })

        if (existingReaction) {
            if (existingReaction.type === type) {
                // if the same reaction exists, remove it (toggle off)
                await Reaction.deleteOne({
                    _id: existingReaction._id
                })

                // remove the notification (non-blocking)
                Notification.deleteOne({
                    recipient: post.author,
                    type: "reaction",
                    triggeredBy: userId,
                    relatedPost: postId
                }).catch(err => console.error("Error deleting reaction notification:", err.message));

                return res.status(200).json({
                    success: true,
                    message: `Reaction (${type}) removed successfully`
                })
            } else {
                // if a different reaction exists, update it
                existingReaction.type = type;
                await existingReaction.save();

                return res.status(200).json({
                    success: true,
                    message: `Reaction updated to ${type}`
                })
            }
        }

        // if no reaction exists, create a new one
        await Reaction.create({
            post: postId,
            type,
            user: userId
        })

        // add reaction notification in parallel (non-blocking) if the the likes if not the post author
        if (userId.toString() !== post.author.toString()) {
            Notification.create({
                recipient: post.author,
                type: 'reaction',
                triggeredBy: userId,
                relatedPost: postId
            }).catch(err => console.error("Error adding reaction notification:", err.message));
        }

        res.status(201).json({
            success: true,
            message: `Reaction (${type}) added successfully`
        })

    } catch (err) {
        console.error("Error in toggle reaction:", err.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}
