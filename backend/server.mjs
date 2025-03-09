import express from "express";
import { connectDB } from "./configs/db.mjs";
import { ENV_VARS } from "./configs/enVars.mjs";
import cookieParser from "cookie-parser";
import passport from "passport";
import { configurePassport } from "./configs/passport.mjs";
import helmet from "helmet";
import cors from "cors";
import { authenticateJWT } from "./middlewares/authMiddleware.mjs";
import fileUpload from "express-fileupload";

import authRoutes from "./routes/authRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import connectionRoutes from "./routes/connectionRoutes.mjs";
import postRoutes from "./routes/postRoutes.mjs";
import reactionRoutes from "./routes/reactionRoutes.mjs";
import commentRoutes from "./routes/commentRoutes.mjs";
import notificationRoutes from "./routes/notificationRoutes.mjs";


const app = express();

// global middlewares
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    abortOnLimit: true,
    responseOnLimit: "File size too large. Maximum allowed size is 10MB",
    safeFileNames: true,
    preserveExtension: true
}));

app.use(cors({
    origin: [ENV_VARS.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
}))

app.use(passport.initialize());
configurePassport();

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authenticateJWT, userRoutes);
app.use("/api/v1/connections", authenticateJWT, connectionRoutes);
app.use("/api/v1/posts", authenticateJWT, postRoutes);
app.use("/api/v1/reactions", authenticateJWT, reactionRoutes);
app.use("/api/v1/comments", authenticateJWT, commentRoutes);
app.use("/api/v1/notifications", authenticateJWT, notificationRoutes);


const PORT = ENV_VARS.PORT;
app.listen(PORT, "0.0.0.0", () => {
    connectDB();
    console.log(`listening on http://0.0.0.0:${PORT}`)
})


// to handle notifications in large scale apps, we should use:  BullMQ + Redis  
// send emails
// polling concept & websockets

/*
 * 10 Habits to Become a Successful Developer
 1. Practice coding daily.
 2. Read and analyze other developers' code.
 3. Understand the fundamentals before focusing on tools.
 4. Solve real-world problems, not just write code.
 5. Keep learning and stay updated with new technologies.
 6. Write clean, structured, and maintainable code.
 7. Understand systems architecture, not just individual code snippets.
 8. Work on real projects to gain hands-on experience.
 9. Engage with and contribute to the developer community.
10. Learn to debug efficiently and optimize performance.
*/

// learn "numeral" to deal with short forms of numbers, like 1k, 1M...
// what is SSO ( Single Sign-On)
// Learn GraphQL
// Explorer Bun.js
// Design patterns
// Js questions / React questions
// caching: Server-Side Caching...