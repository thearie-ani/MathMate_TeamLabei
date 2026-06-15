import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";

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

server.use(errorMiddleware);


server.use("/api/auth", authRoutes);


server.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
    connectDB();
})