import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import { upload } from "../middleware/upload/uploadMiddleware.js";

const router = express.Router();

router.post('/image', authenticate, authorize('admin'), upload.single('image'), uploadImage);

export default router;