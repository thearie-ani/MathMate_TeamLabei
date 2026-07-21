// import express from "express";
// import multer from "multer";

// import * as ChatbotController from "../controllers/chatbotController.js";
// import { authenticate } from "../middleware/authMiddleware.js";
// import { sendMessage } from "../controllers/chatbotController.js";
// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// router.post("/", authenticate, ChatbotController.sendMessage);
// router.post('/chat', authenticate, upload.single('image'), sendMessage);

// export default router;

import express from "express";
import multer from "multer";

import { sendMessage } from "../controllers/chatbotController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticate, upload.single("image"), sendMessage);

export default router;