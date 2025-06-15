import { configDotenv } from "dotenv";
configDotenv();

export const ENV_VARS = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/linkedIn",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
    MAILTRAP_SENDER_EMAIL: process.env.MAILTRAP_SENDER_EMAIL,
    MAILTRAP_SENDER_NAME: process.env.MAILTRAP_SENDER_NAME || "LinkedIn Clone",
    SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN,
    SECRET_ACCESS_TOKEN: process.env.SECRET_ACCESS_TOKEN,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}