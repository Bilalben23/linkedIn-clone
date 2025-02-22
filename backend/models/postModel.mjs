import { Schema, model } from "mongoose";
import { Comment } from "./commentModel.mjs";
import { Like } from "./likeModel.mjs";
import { Notification } from "./notificationModel.mjs";


const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true })

postSchema.index({ author: 1 });

postSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const postId = this._id;
    if (!postId) return next();

    try {
        if (postId) {
            await Promise.all([
                Like.deleteMany({ post: postId }),
                Comment.deleteMany({ post: postId }),
                Notification.deleteMany({ relatedPost: postId })
            ])
        }
        next();
    } catch (err) {
        next(err)
    }
})

export const Post = model("Post", postSchema);