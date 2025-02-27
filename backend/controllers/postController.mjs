import { Post } from "../models/postModel.mjs"
import { Reaction } from "../models/reactionModel.mjs";
import cloudinary from "../configs/cloudinary.mjs";
import { uploadImage } from "../utils/uploadImage.mjs";
import { Connection } from "../models/connectionModel.mjs";
import { Comment } from "../models/commentModel.mjs";

export const getFeedPosts = async (req, res) => {
    const userId = req.user._id;
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;

    try {
        // Start fetching totalPosts in parallel with post data
        const totalPostsPromise = Post.countDocuments({ author: { $ne: userId } });

        // Fetch posts
        const posts = await Post.find({ author: { $ne: userId } })
            .populate("author", "name username profilePicture headline")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .lean();

        // Get reactions count for each post
        const postIds = posts.map(post => post._id);
        const reactionsPromise = Reaction.aggregate([
            { $match: { post: { $in: postIds } } },
            {
                $group: {
                    _id: "$post",
                    reactionsCount: { $sum: 1 },
                    uniqueReactions: { $addToSet: "$type" },
                    userReactions: {
                        $push: {
                            user: "$user",
                            type: "$type"
                        }
                    }
                }
            }
        ]);

        // Fetch comments count
        const commentsPromise = Comment.aggregate([
            { $match: { post: { $in: postIds } } },
            {
                $group: {
                    _id: "$post",
                    commentsCount: { $sum: 1 }
                }
            }
        ]);

        // Execute all queries in parallel
        const [reactionsData, commentsData, totalPosts] = await Promise.all([
            reactionsPromise,
            commentsPromise,
            totalPostsPromise
        ]);

        // Convert reactionsData into a map for quick lookup
        const reactionsMap = new Map(
            reactionsData.map(reaction => [
                reaction._id.toString(),
                {
                    count: reaction.reactionsCount,
                    unique: reaction.uniqueReactions,
                    hasReacted: reaction.userReactions.some(r => r.user.toString() === userId.toString()),
                    userReactionType: reaction.userReactions.find(r => r.user.toString() === userId.toString())?.type || null
                }
            ])
        );

        // Convert commentsData into a map for quick lookup
        const commentsMap = new Map(commentsData.map(comment => [comment._id.toString(), comment.commentsCount]));

        // Attach reactions and comments count to each post
        posts.forEach(post => {
            const reactionInfo = reactionsMap.get(post._id.toString()) || {
                count: 0,
                unique: [],
                hasReacted: false,
                userReactionType: null
            };

            post.reactions = {
                reactionsCount: reactionInfo.count,
                uniqueReactions: reactionInfo.unique,
                hasReacted: reactionInfo.hasReacted,
                userReactionType: reactionInfo.userReactionType
            };

            post.commentsCount = commentsMap.get(post._id.toString()) || 0;

            // TODO: add reposts logic in feature improvements
            post.repostsCount = 0
        });

        // Pagination
        const totalPages = Math.ceil(totalPosts / limit);
        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalPosts,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
        };

        res.status(200).json({
            success: true,
            data: posts,
            pagination
        });

    } catch (err) {
        console.error("Error in getFeedPosts:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};



export const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const [post, reactionsCount] = await Promise.all([
            Post.findById(postId).populate("author", "name username profilePicture headline"),
            Reaction.countDocuments({ post: postId })
        ])

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            data: post,
            reactionsCount
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const createPost = async (req, res) => {
    const data = { ...req.body, author: req.user._id };
    const timestamp = Date.now();
    const userId = req.user._id;

    try {
        // create a post instance but don't save it yet
        const newPost = new Post(data);

        // upload image if provided
        if (req.files?.image) {
            try {
                const postImageName = `post_${newPost._id}_${timestamp}`;
                const newPostImage = await uploadImage(
                    req.files.image,
                    "linkedin/post_images",
                    postImageName
                )

                newPost.image = newPostImage;
            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Upload image post failed"
                })
            }
        }

        // save the post only after image upload
        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post Created successfully",
            data: newPost
        })


        // process notification asynchronously (non-blocking)
        Connection.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: "accepted"
        })
            .select("sender receiver")
            .lean()
            .then(connections => {
                const notifications = connections.map(conn =>
                    conn.sender.toString() === userId.toString() ? conn.receiver : conn.sender
                ).map(recipient => ({
                    recipient,
                    type: "newPost",
                    triggeredBy: userId,
                    relatedPost: newPost._id
                }));

                if (notifications.length) {
                    Notification.insertMany(notifications).catch(err =>
                        console.error("Error inserting notifications:", err)
                    );
                }
            })
            .catch(err => console.error("Error fetching connections:", err));


    } catch (err) {
        console.error("Error in createPost:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const updatePost = async (req, res) => {
    const userId = req.user._id;
    const { postId } = req.params;
    const data = req.body;
    const timestamp = Date.now();

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are unauthorized to update this post"
            })
        }

        let deleteOldImagePromise = null;

        if (req.files?.image) {

            // upload the new image
            try {
                const postImageName = `post_${post._id}_${timestamp}`;
                const newPostImage = await uploadImage(
                    req.files.image,
                    "linkedin/post_images",
                    postImageName
                )

                data.image = newPostImage;
            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Upload image post failed"
                })
            }

            // Delete old image in parallel
            if (post.image) {
                deleteOldImagePromise = cloudinary.uploader.destroy(post.image);
            }
        }

        const updatePost = await Post.findByIdAndUpdate(
            postId,
            { $set: data },
            { new: true }
        )

        // Execute image deletion in parallel (if applicable)
        if (deleteOldImagePromise) {
            await Promise.allSettled([deleteOldImagePromise]);
        }

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatePost
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // check if the current user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are unauthorized to delete this post"
            })
        }

        // delete image from cloudinary in parallel with post deletion
        const deleteImagePromise = post.image ? cloudinary.uploader.destroy(post.image) : Promise.resolve();
        const deletePostPromise = Post.deleteOne({ _id: postId });

        // Execute both operations in parallel
        await Promise.all([
            deleteImagePromise,
            deletePostPromise
        ]);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}