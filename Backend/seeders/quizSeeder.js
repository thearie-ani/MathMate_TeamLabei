import mongoose from "mongoose";
import dotenv from "dotenv";

import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// import question banks
import { functionQuestions, limitQuestions, derivativesQuestions, applicationsQuestions, integrationQuestions } from "../data/quiz.js";


// =======================
// HELPERS
// =======================
const getAdmin = async () => {
  return await User.findOne({ role: "admin" });
};

const createQuestion = (q) => ({
  text: q.text,
  options: q.options,
  correctIndex: q.correctIndex,
  explaination: q.explaination,
  points: q.points || 1,
});

// =======================
// COURSE DATA
// =======================
const courseData = {
  title: "Calculus Volume 1",
  slug: "calculus-volume-1",
  description:
    "Complete Calculus 1 course covering functions, limits, derivatives, applications, and integration.",
};

// =======================
// TOPIC STRUCTURE
// =======================
const LessonsSeed = [
  {
    title: "Functions and Graphs",
    order: 1,
    questions: functionQuestions,
  },
  {
    title: "Limits and Continuity",
    order: 2,
    questions: limitQuestions,
  },
  {
    title: "Derivatives",
    order: 3,
    questions: derivativesQuestions,
  },
  {
    title: "Applications of Derivatives",
    order: 4,
    questions: applicationsQuestions,
  },
  {
    title: "Integration",
    order: 5,
    questions: integrationQuestions,
  },
];

// =======================
// MAIN SEED FUNCTION
// =======================
export const seedCalculusCourse = async () => {
  try {
    const admin = await getAdmin();

    if (!admin) {
      console.log("Admin not found");
      return;
    }

    // =======================
    // 1. COURSE
    // =======================
    let course = await Course.findOne({ title: courseData.title });

    if (!course) {
      course = await Course.create({
        ...courseData,
        createdBy: admin._id,
      });

      // console.log("Course created");
    } else {
      // console.log("Course already exists");
    }

    // =======================
    // 2. Lesson + QUIZZES
    // =======================
    for (const lessonSeed of LessonsSeed) {
      let lesson = await Lesson.findOne({
        title: lessonSeed.title,
        course: course._id,
      });

      if (!lesson) {
        lesson = await Lesson.create({
        title: lessonSeed.title,
        slug: lessonSeed.title
          .toLowerCase()
          .replace(/\s+/g, "-"),
        content: `${lessonSeed.title} - Calculus 1 material`,
        courseId: course._id,
        order: lessonSeed.order,
      });

        // console.log(`Topic created: ${topic.title}`);
      }

      // =======================
      // 3. QUIZ PER TOPIC
      // =======================
      const existingQuiz = await Quiz.findOne({
        title: `${lessonSeed.title} Quiz`,
      });

      if (!existingQuiz) {
        await Quiz.create({
          title: `${lessonSeed.title} Quiz`,
          description: `Quiz for ${lessonSeed.title}`,
          courseId: course._id,
          lessonId: lesson._id,
          passingScore: 60,
          isPublished: true,
          createdBy: admin._id,
          questions: lessonSeed.questions.map(createQuestion),
        });

        // console.log(`Quiz created: ${topicSeed.title}`);
      } else {
        // console.log(`Quiz already exists: ${topicSeed.title}`);
      }
    }

    console.log("Calculus seeding completed!");
  } catch (error) {
    console.error(" Seed error:", error.message);
  }
};