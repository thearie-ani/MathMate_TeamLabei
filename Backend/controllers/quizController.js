

import * as quizRepo from "../repository/quizRepository.js";
import * as submissionRepo from "../repository/submissionRepository.js";

// function to correct before sending
const sanitizeForStudent = (quiz) => ({
  _id: quiz._id,
  title: quiz.title,
  courseId: quiz.courseId,
  chapter: quiz.chapter,
  description: quiz.description,
  questions: quiz.questions.map((q) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
  })),
});

// calculate score
const gradeQuiz = (quiz, answers) => {
  let score = 0;

  const gradedAnswers = answers.map((a) => {
    const question = quiz.questions.find(
      (q) => q._id.toString() === a.questionId
    );

    const isCorrect =
      question && question.correctIndex === a.selectedIndex;

    if (isCorrect) score++;

    return {
      questionId: a.questionId,
      selectedIndex: a.selectedIndex,
      isCorrect,
      pointsEarned: isCorrect ? 1 : 0,
      correctIndex: question?.correctIndex,   // FIX: needed so student-facing result view can show the right answer post-grading
      explaination: question?.explaination,    };
  });

  const percentage = Math.round((score / quiz.questions.length) * 100);

  return {
    score,
    percentage,
    gradedAnswers,
  };
};

// quiz

export const getAllQuizzes = async (req, res) => {
  try {
    const { courseId, chapter } = req.query;

    let quizzes = await quizRepo.findAll({
      courseId,
      chapter,
    });

    const role = req.user?.role || "guest";

    if (role !== "admin") {
      quizzes = quizzes
        .filter((q) => q.isPublished)
        .map(sanitizeForStudent);
    }

    return res.status(200).json({
      success: true,
      message: "Quizzes retrieved",
      data: { quizzes },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await quizRepo.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const role = req.user?.role || "guest";

    if (role !== "admin" && !quiz.isPublished) {
      return res.status(403).json({
        success: false,
        message: "This quiz is not available yet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz retrieved",
      data: role === "admin" ? quiz : sanitizeForStudent(quiz),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, courseId, chapter, description, passingScore, isPublished, questions } = req.body;

    if (!title || !courseId || chapter|| !questions) {
      return res.status(400).json({
        success: false,
        message: "Title, course, chapter and questions are required",
      });
    }

    if (!Array.isArray(questions) || questions.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Quiz must have at least one question",
      });
    }

    const quiz = await quizRepo.create({
      title,
      courseId,
      chapter,
      description,
      passingScore,
      isPublished,
      questions,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: { quiz },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await quizRepo.updateById(req.params.id, req.body);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: { quiz },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await quizRepo.deleteById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getQuizHistoryForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      submissionRepo.findByStudentId(studentId, { skip, limit: limitNum }),
      submissionRepo.countByStudentId(studentId),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: "Quiz history retrieved",
      data: { submissions },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getQuizHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      submissionRepo.findByStudentId(req.user._id, { skip, limit: limitNum }),
      submissionRepo.countByStudentId(req.user._id),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: "Quiz history retrieved",
      data: { submissions },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// submission

export const submitQuiz = async (req, res) => {
  try {
    const quiz = await quizRepo.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({
        success: false,
        message: "This quiz is not available yet",
      });
    }

    const existingSubmission = await submissionRepo.findByQuizAndStudent(
      req.params.id,
      req.user._id
    );

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: "You already submitted this quiz. Use retake instead.",
      });
    }

    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers must be a non-empty array",
      });
    }

    const { score, percentage, gradedAnswers } = gradeQuiz(quiz, answers);

    const passed = percentage >= quiz.passingScore;

    const submission = await submissionRepo.create({
      quiz: quiz._id,
      course: quiz.courseId,
      chapter: quiz.chapter,
      student: req.user._id,
      answers: gradedAnswers,
      score: percentage,
      pointsEarned: score,
      totalPoints: quiz.questions.length,
      passed,
      attemptNumber: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully",
      data: { submission },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const retakeQuiz = async (req, res) => {
  try {
    const quiz = await quizRepo.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const submission = await submissionRepo.findByQuizAndStudent(
      req.params.id,
      req.user._id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "No previous submission found. Submit the quiz first.",
      });
    }

    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers must be a non-empty array",
      });
    }

    const { score, percentage, gradedAnswers } = gradeQuiz(quiz, answers);

    const passed = percentage >= quiz.passingScore;

    const updatedSubmission = await submissionRepo.retakeSubmission({
      submissionId: submission._id,
      answers: gradedAnswers,
      score: percentage,
      pointsEarned: score,
      totalPoints: quiz.questions.length, // FIX: was `q.points` reduce, which is NaN since questions have no `points` field — now matches submitQuiz
      passed,
      attemptNumber: (submission.attemptNumber || 1) + 1,
    });

    return res.status(200).json({
      success: true,
      message: "Quiz retaken successfully",
      data: { submission: updatedSubmission },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getMySubmission = async (req, res) => {
  try {
    const submission = await submissionRepo.findByQuizAndStudent(
      req.params.id,
      req.user._id
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "No submission found for this quiz",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission retrieved",
      data: { submission },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllSubmissionByQuiz = async (req, res) => {
  try {
    const quiz = await quizRepo.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const submissions = await submissionRepo.findByQuizId(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Submissions retrieved",
      data: { submissions, total: submissions.length },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getMyQuizHistory = async (req, res) => {
  try {
    const submissions = await submissionRepo.findByStudentId(req.user._id);

    return res.status(200).json({
      success: true,
      data: {
        submissions,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};