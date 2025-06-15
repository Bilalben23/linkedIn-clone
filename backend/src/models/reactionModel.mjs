import { model, Schema } from "mongoose";

const reactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "celebrate", "support", "love", "insightful", "funny"],
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true })

reactionSchema.index({ user: 1, post: 1 }, { unique: true });

export const Reaction = model("Reaction", reactionSchema);

