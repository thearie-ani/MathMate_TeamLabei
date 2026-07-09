import mongoose from "mongoose";
import dotenv from "dotenv";

import Course from "../models/Course.js";
import Topic from "../models/Topics.js";
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
  title: "Calculus 1",
  description:
    "Complete Calculus 1 course covering functions, limits, derivatives, applications, and integration.",
};

// =======================
// TOPIC STRUCTURE
// =======================
const topicsSeed = [
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
    // 2. TOPICS + QUIZZES
    // =======================
    for (const topicSeed of topicsSeed) {
      let topic = await Topic.findOne({
        title: topicSeed.title,
        course: course._id,
      });

      if (!topic) {
        topic = await Topic.create({
          title: topicSeed.title,
          content: `${topicSeed.title} - Calculus 1 material`,
          course: course._id,
          order: topicSeed.order,
        });

        // console.log(`Topic created: ${topic.title}`);
      }

      // =======================
      // 3. QUIZ PER TOPIC
      // =======================
      const existingQuiz = await Quiz.findOne({
        title: `${topicSeed.title} Quiz`,
      });

      if (!existingQuiz) {
        await Quiz.create({
          title: `${topicSeed.title} Quiz`,
          description: `Quiz for ${topicSeed.title}`,
          course: course._id,
          topic: topic._id,
          passingScore: 60,
          isPublished: true,
          createdBy: admin._id,
          questions: topicSeed.questions.map(createQuestion),
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