import { Router } from "express";
import * as userController from "../controllers/userController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = Router();

// ─── Student — own profile ───────────────────────────────────
router.get("/me", authenticate, userController.getMe);
router.put("/me", authenticate, userController.updateMe);
router.put("/me/password",authenticate, userController.changePassword);
router.put("/me/avatar", authenticate,  userController.updateAvatar);
router.delete("/me", authenticate, userController.deleteMe);

// ─── Admin — manage all users ────────────────────────────────
router.get("/", authenticate, authorize("admin"), userController.getAllUsers);
router.get("/:id", authenticate, authorize("admin"), userController.getUserById);

export default router;