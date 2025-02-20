import { Post } from "../models/postModel.mjs"
import { Like } from "../models/likeModel.mjs";
import cloudinary from "../configs/cloudinary.mjs";

export const getFeedPosts = async (req, res) => {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 20;

    try {

        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await Post.find({})
            .populate("author", "name username profilePicture headline")
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((pageNumber - 1) * limit)
            .lean();

        // Get likes count for each post in one query
        const postIds = posts.map(post => post._id);
        const likesData = await Like.aggregate([
            {
                $match: { post: { $in: postIds } }
            },
            {
                $group: {
                    _id: "$post", likesCount: { $sum: 1 }
                }
            }
        ])

        // Convert likesData into a map for quick lookup
        const likesMap = new Map(likesData.map(like => [like._id.toString(), like.likesCount]));

        // attach likes to each post
        posts.forEach(post => {
            post.likesCount = likesMap.get(post._id.toString()) || 0;
        })

        const pagination = {
            currentPage: pageNumber,
            totalPages,
            totalPosts,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }

        res.status(200).json({
            success: true,
            data: posts,
            pagination
        })

    } catch (err) {
        console.error("Error in getFeedPosts:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const getPostById = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")


        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            data: post
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
    try {
        const data = { ...req.body, author: req.user._id };

        const newPost = new Post(data);

        if (data.image) {
            try {
                const result = await cloudinary.uploader.upload(data.image, {
                    folder: "linkedin_posts",
                    public_id: `linkedin_post_${newPost._id}`
                });
                newPost.image = result.public_id;
            } catch (uploadError) {
                return res.status(400).json({
                    success: false,
                    message: "Upload image post failed"
                })
            }
        }

        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post Created successfully",
            data: newPost
        })

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

    try {
        const post = await Post.findById(postId).lean();

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

        const updatePost = await Post.findByIdAndUpdate(
            postId,
            { $set: data },
            { new: true }
        )

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

        if (post.image) {
            try {
                await cloudinary.uploader.destroy(post.image);
            } catch (cloudinaryError) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete image from cloudinary"
                })
            }
        }

        await Post.deleteOne({ _id: postId });

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
