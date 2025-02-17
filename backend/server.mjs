import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./configs/db.mjs";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.mjs";
import passport from "passport";
import { configurePassport } from "./configs/passport.mjs";
import helmet from "helmet";
import cors from "cors";


const app = express();

// global middlewares
configDotenv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet())
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}))

app.use(passport.initialize());
configurePassport();


app.use("/api/v1/auth/", authRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log('listening on port ')
})