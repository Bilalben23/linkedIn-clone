import { Schema, model } from "mongoose";
import { Comment } from "./commentModel.mjs";
import { Like } from "./likeModel.mjs";


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
    try {
        if (postId) {
            await Promise.all([
                Like.deleteMany({ post: this._id }),
                Comment.deleteMany({ post: this._id })
            ])
        }
        next();
    } catch (err) {
        next(err)
    }
})

export const Post = model("Post", postSchema);