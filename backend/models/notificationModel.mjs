import { Schema, model } from "mongoose";


const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["like", "comment", "connectionAccepted", "newPost"]
    },
    triggeredBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    relatedPost: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: function () {
            return this.type !== "connectionAccepted";
        }
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true })

notificationSchema.index({ recipient: 1, createdAt: -1 })

export const Notification = model("Notification", notificationSchema);
