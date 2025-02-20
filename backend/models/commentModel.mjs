import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true })

commentSchema.index({ author: 1 });
commentSchema.index({ post: 1 });

export const Comment = model("Comment", commentSchema);