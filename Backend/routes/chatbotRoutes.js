import express from "express";
import * as ChatbotController from "../controllers/chatbotController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, ChatbotController.sendMessage);

export default router;