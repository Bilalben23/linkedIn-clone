import { Schema, model } from "mongoose";
import { Post } from "./postModel.mjs";
import { Comment } from "./commentModel.mjs";
import { Like } from "./likeModel.mjs";
import { Connection } from "./connectionModel.mjs";
import { Notification } from "./notificationModel.mjs";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String, // store only the Cloudinary public_id
        default: ""
    },
    bannerImg: {
        type: String, // store only the cloudinary public_id
        default: ""
    },
    headline: {
        type: String,
        default: "LinkedIn User",
        trim: true
    },
    location: {
        type: String,
        default: "Earth",
        trim: true
    },
    about: {
        type: String,
        default: "",
        trim: true
    },
    skills: [String],
    experiences: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
            },
            description: String
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            fieldOfStudy: {
                type: String,
                required: true
            },
            startYear: {
                type: Number,
                required: true
            },
            endYear: {
                type: Number
            }
        }
    ]
}, { timestamps: true })

userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    const userId = this._id;
    try {
        if (userId) {
            await Promise.all([
                Post.deleteMany({ author: userId }),
                Comment.deleteMany({ author: userId }),
                Like.deleteMany({ author: userId }),
                Connection.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] }),
                Notification.deleteMany({ recipient: userId })
            ])
        }
        next();
    } catch (err) {
        next(err)
    }
})

export const User = model("User", userSchema);