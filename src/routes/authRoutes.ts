import { Router } from "express";
import * as AuthController from "../controllers/authController";
import { loginRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", loginRateLimiter, AuthController.login);
router.post("/logout", AuthController.logout);

export default router;
