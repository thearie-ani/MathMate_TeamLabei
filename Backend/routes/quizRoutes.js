import express from "express";

import * as QuizController from "../controllers/quizController.js"

import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

const router = express.Router();


// all roles
router.get('/', authenticate, QuizController.getAllQuizzes);
router.get('/:id', authenticate, QuizController.getQuizById);

// admin only
router.post('/', authenticate, authorize("admin"), QuizController.createQuiz);
router.put('/:id', authenticate, authorize("admin"), QuizController.updateQuiz);
router.delete('/:id', authenticate, authorize("admin"), QuizController.deleteQuiz);
router.get('/:id/submissions', authenticate, authorize("admin"), QuizController.getAllSubmissionByQuiz);
router.get('/history/:studentId', authenticate, authorize("admin"), QuizController.getQuizHistoryForStudent);
router.get('/history', authenticate, authorize("admin"), QuizController.getQuizHistory);

// student only
router.post('/:id/submit', authenticate, authorize("student"),  QuizController.submitQuiz);
router.post('/:id/retake', authenticate, authorize("student"), QuizController.retakeQuiz);
router.get('/:id/submissions/me', authenticate, authorize("student"), QuizController.getMySubmission)

export default router;