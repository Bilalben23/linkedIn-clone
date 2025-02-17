import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.mjs";
import { getPublicProfile, getSuggestedConnections, updateProfile } from "../controllers/userController.mjs";

const router = Router();

router.get("/suggestions", authenticateJWT, getSuggestedConnections);

router.get("/:username", authenticateJWT, getPublicProfile);

router.patch("/profile", authenticateJWT, updateProfile)

export default router;