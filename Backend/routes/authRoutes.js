import express from "express";

import * as authController from "../controllers/authController.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail)
router.post("/resend-verification", authController.resendVerificationEmail);

export default router;