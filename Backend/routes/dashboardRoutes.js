import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = Router();

router.get("/student", authenticate, authorize("student"), dashboardController.getStudentDashboard);
router.get("/admin", authenticate, authorize("admin"), dashboardController.getAdminDashboard);

export default router;