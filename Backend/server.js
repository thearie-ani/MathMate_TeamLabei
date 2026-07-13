import express from "express";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/database.js";
import { seedDefaultUsers } from "./seeders/userSeeder.js";
import { seedCalculusCourse } from "./seeders/quizSeeder.js";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import chatborRoutes from "./routes/chatbotRoutes.js";

import logMiddleware from "./middleware/logMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const server = express();

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

server.use("/api/auth", authRoutes);
server.use("/api/quizzes", quizRoutes);
server.use("/api/courses", courseRoutes);
server.use("/api/users", userRoutes);
server.use("/api/dashboard", dashboardRoutes);
server.use("/api/chat", chatborRoutes);

await connectDB();
// await seedDefaultUsers();
await seedCalculusCourse();

server.listen(process.env.PORT, () => {    
    console.log(`Server running on http://localhost:${process.env.PORT}`);
})