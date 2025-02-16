import { connect } from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error');
        process.exit(1);
    }
}