import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();

router.post('/image', authenticate, authorize('admin'), uploadImage);

export default router;