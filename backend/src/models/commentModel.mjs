import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    user: {
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

commentSchema.index({ user: 1, post: 1 });

export const Comment = model("Comment", commentSchema);