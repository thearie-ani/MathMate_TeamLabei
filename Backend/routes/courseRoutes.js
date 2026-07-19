import express from "express";

import * as CourseController from "../controllers/courseController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();

// lesson status
router.get("/:courseId/lessons/:lessonId/status", authenticate, authorize("student"), CourseController.getLessonStatus);

// --- static/specific routes first (must come before "/:courseId") ---
router.get("/my-courses", authenticate, authorize("student"), CourseController.getMyCourses);
router.get("/progress/me", authenticate, authorize("student"), CourseController.getMyProgress);
router.get("/slug/:slug", authenticate, CourseController.getCourseBySlug);

// --- courses: public (filtered by guest/admin) ---
router.get("/", authenticate, CourseController.getAllCourses);
router.get("/:courseId", authenticate, CourseController.getCourseById);

// --- courses: admin ---
router.post("/", authenticate, authorize("admin"), CourseController.createCourse);
router.put("/:courseId", authenticate, authorize("admin"), CourseController.updateCourse);
router.delete("/:courseId", authenticate, authorize("admin"), CourseController.deleteCourse);

// --- lessons: public (filtered) ---
router.get("/:courseId/lessons", authenticate, CourseController.getLessonsByCourse);
router.get("/lessons/:lessonId", authenticate, CourseController.getLessonById);

// --- lessons: admin ---
router.post("/:courseId/lessons", authenticate, authorize("admin"), CourseController.createLesson);
router.put("/lessons/:lessonId", authenticate, authorize("admin"), CourseController.updateLesson);
router.delete("/lessons/:lessonId", authenticate, authorize("admin"), CourseController.deleteLesson);

// --- student ---
router.post("/:courseId/enroll", authenticate, authorize("student"), CourseController.enrollCourse);
router.post("/lessons/:lessonId/complete", authenticate, authorize("student"), CourseController.completeLesson);
router.get("/:courseId/progress", authenticate, authorize("student"), CourseController.getCourseProgress);

export default router;