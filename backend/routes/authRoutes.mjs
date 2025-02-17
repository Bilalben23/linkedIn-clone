import { Router } from "express";
import { logout, signin, signup, refreshToken, getCurrentUser } from "../controllers/authController.mjs";
import { authenticateJWT } from "../middlewares/authMiddleware.mjs";

const router = Router();


router.post("/signin", signin);

router.post("/signup", signup);

router.get("refresh-token", refreshToken);

router.get("/logout", logout);

router.get("/me", authenticateJWT, getCurrentUser);

export default router;