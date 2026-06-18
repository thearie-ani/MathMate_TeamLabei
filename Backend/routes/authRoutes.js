import express from "express";

import * as auth from "../controllers/authController.js"

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
// router.post("/logout", auth.logout);
router.post("/forgot", auth.forgotPassword);
router.post("/reset/:token", auth.resetPassword);


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