import { Router } from "express";
import { logout, signin, signup, getCurrentUser } from "../controllers/authController.mjs";

const router = Router();


router.post("/signin", signin);

router.post("/signup", signup);

router.post("/logout", logout);

router.get("/me", getCurrentUser);


export default router;