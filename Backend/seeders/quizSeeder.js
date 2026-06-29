import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// connect DB (only if you run standalone seed)
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding");
};

// helper: get admin user
const getAdmin = async () => {
  return await User.findOne({ role: "admin" });
};

// ===============================
// QUIZ DATA (SAMPLE STRUCTURE)
// ===============================
const quizData = {
  title: "Calculus 1 - Full MCQ Exam (100 Questions)",
  description:
    "Comprehensive Calculus 1 quiz covering functions, limits, derivatives, integrals, and applications.",
  course: new mongoose.Types.ObjectId(), // replace with real course id if you have
  topic: null,
  timeLimit: 120,
  passingScore: 60,
  isPublished: true,
  questions: [],
};

// ===============================
// YOU PASTE QUESTIONS HERE
// ===============================

// Example converter function
const createQuestion = (text, options, correctIndex, explanation, points = 1) => {
  return {
    text,
    options,
    correctIndex,
    explaination: explanation, // ⚠️ spelling matches your schema
    points,
  };
};

// ===============================
// SAMPLE (YOU WILL EXTEND TO 100)
// ===============================
quizData.questions.push(
  createQuestion(
    "A function is defined as:",
    ["A relation", "A function", "A domain", "An intercept"],
    1,
    "A function assigns exactly one output for each input."
  )
);

// ===============================
// MAIN SEED FUNCTION
// ===============================
export const seedQuiz = async () => {
  try {
    const admin = await getAdmin();

    if (!admin) {
      console.log("❌ No admin found. Create admin first.");
      return;
    }

    const existingQuiz = await Quiz.findOne({
      title: quizData.title,
    });

    if (existingQuiz) {
      console.log("⚠️ Quiz already exists. Skipping seed.");
      return;
    }

    const quiz = await Quiz.create({
      ...quizData,
      createdBy: admin._id,
    });

    console.log("✅ Quiz seeded successfully:", quiz.title);
  } catch (error) {
    console.error("❌ Quiz Seed Error:", error.message);
  }
};