import express from "express";
import { connectDB } from "./configs/db.mjs";
import { ENV_VARS } from "./configs/enVars.mjs";
import cookieParser from "cookie-parser";
import passport from "passport";
import { configurePassport } from "./configs/passport.mjs";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";

const app = express();

// global middlewares
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

// API Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)


const PORT = ENV_VARS.PORT;
app.listen(PORT, () => {
    connectDB();
    console.log(`listening on http://localhost:${PORT}`)
})