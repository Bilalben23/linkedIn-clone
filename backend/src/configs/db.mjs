import { connect } from "mongoose";
import { ENV_VARS } from "./enVars.mjs";

export const connectDB = async () => {
    try {
        const connection = await connect(ENV_VARS.MONGO_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error');
        process.exit(1);
    }
}