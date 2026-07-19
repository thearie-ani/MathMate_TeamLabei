import express from "express";
import previewOpenstaxImport from "../controllers/importController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();

router.post('/openstax', authenticate, authorize('admin'), previewOpenstaxImport);

export default router;