import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/refresh", refreshToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/verify-email", verifyEmail);

// OAuth placeholders (Passport will handle)
router.get("/google", (req, res) => {
  res.send("Google OAuth coming soon");
});

router.get("/google/callback", (req, res) => {
  res.send("Google callback");
});

router.get("/facebook", (req, res) => {
  res.send("Facebook OAuth coming soon");
});

router.get("/facebook/callback", (req, res) => {
  res.send("Facebook callback");
});

export default router;