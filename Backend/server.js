import express from "express";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";
import { seedDefaultUsers } from "./seeders/userSeeder.js";
import { seedCalculusCourse } from "./seeders/quizSeeder.js";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatborRoutes from "./routes/chatbotRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import logMiddleware from "./middleware/logMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const server = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);


server.use(express.json());
server.use(cookieParser());


server.use(logMiddleware);
server.use(errorMiddleware);

server.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.use("/api/auth", authRoutes);
server.use("/api/quizzes", quizRoutes);
server.use("/api/courses", courseRoutes);
server.use("/api/users", userRoutes);
server.use("/api/dashboard", dashboardRoutes);
server.use("/api/chat", chatborRoutes);
server.use("/api/import", importRoutes);
server.use("/api/uploads", uploadRoutes);

await connectDB();
// await seedDefaultUsers();
// await seedCalculusCourse();

server.listen(process.env.PORT, () => {    
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})