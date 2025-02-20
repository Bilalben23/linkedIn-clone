import { Schema, model } from "mongoose";

const connectionSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending"
    }
}, { timestamps: true })

connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });
connectionSchema.index({ status: 1 });

export const Connection = model("Connection", connectionSchema);