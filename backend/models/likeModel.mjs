import { model, Schema } from "mongoose";

const likeSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true })

likeSchema.index({ author: 1, post: 1 }, { unique: true });

export const Like = model("Like", likeSchema);

