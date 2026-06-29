import express from "express";

import * as CourseController from "../controllers/courseController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import { optionalAuth } from "../middleware/guestMiddleware.js";

const router = express.Router();

// all role
router.get("/", optionalAuth, CourseController.getAllCourses);
router.get("/:courseId", optionalAuth, CourseController.getCourseById);

// admin
router.post("/", authenticate, authorize("admmin"), CourseController.createCourse);
router.put("/:courseId", authenticate, authorize("admin"), CourseController.updateCourse);
router.delete("/:courseId", authenticate, authorize("admin"), CourseController.deleteCourse);

// all
router.get("/:courseId/topics", optionalAuth, CourseController.getTopicsByCourse);
router.get("/topics/:topicId", optionalAuth, CourseController.getTopicById);

// admin
router.post("/:courseId/topics", authenticate, authorize("admin"), CourseController.createTopic);
router.put("/topics/:topicId", authenticate, authorize("admin"), CourseController.updateTopic);
router.delete("/topics/:topicId", authenticate, authorize("admin"), CourseController.deleteTopic);

// student

router.post("/:courseId/enroll", authenticate, authorize("student"), CourseController.enrollCourse);
router.get("/my-courses", authenticate, authorize("student"), CourseController.getMyCourses);
router.post("/topics/:topicId/complete", authenticate, authorize("student"), CourseController.completeTopic);
router.get("/:courseId/progress", authenticate, authorize("student"), CourseController.getCourseProgress);
router.get("/progress/me", authenticate, authorize("student"), CourseController.getMyProgress);

export default router;