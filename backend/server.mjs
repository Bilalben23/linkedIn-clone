import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./configs/db.mjs";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.mjs";


const app = express();

// global middlewares
configDotenv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth/", authRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log('listening on port ')
})