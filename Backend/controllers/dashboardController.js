import * as userRepo from "../repository/userReposity.js";
import * as enrollmentRepo from "../repository/progressRepository.js";
import * as quizRepo from "../repository/quizRepository.js";
import * as courseRepo from "../repository/courseRepositoty.js";
import * as topicRepo from "../repository/topicRepository.js";
import * as submissionRepo from "../repository/submissionRepository.js";
import Quiz from "../models/Quiz.js";
import QuizSubmission from "../models/Submission.js";

// ─── Helpers ────────────────────────────────────────────────

// Get student quiz stats (total, avg score)
const getStudentQuizStats = async (studentId) => {
  const result = await QuizSubmission.aggregate([
    { $match: { student: studentId } },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        avgScore: { $avg: "$score" },
      },
    },
  ]);
  return result[0] || { totalQuizzes: 0, avgScore: 0 };
};

// Get how many quizzes student did this week
const getWeeklyQuizCount = async (studentId) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return QuizSubmission.countDocuments({
    student: studentId,
    createdAt: { $gte: weekAgo },
  });
};

// Get student average score from the previous week (for change comparison)
const getPreviousWeekAvgScore = async (studentId) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const result = await QuizSubmission.aggregate([
    {
      $match: {
        student: studentId,
        createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
      },
    },
    { $group: { _id: null, avgScore: { $avg: "$score" } } },
  ]);
  return result[0]?.avgScore || 0;
};

// Get recent quiz submissions for a student
const getRecentSubmissions = (studentId, limit = 10) =>
  QuizSubmission.find({ student: studentId })
    .populate("quiz", "title")
    .populate("course", "title")
    .populate("topic", "title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

// ════════════════════════════════════════════════════════════
//  STUDENT DASHBOARD
//  GET /api/dashboard/student
//  Protected — student only
// ════════════════════════════════════════════════════════════
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Run all queries in parallel for performance
    const [
  enrollments,
  allProgress,
  quizStats,
  recentSubmissions,
  weeklyQuizCount,
  prevWeekAvgScore,
] = await Promise.all([
  enrollmentRepo.findByStudent(studentId),
  enrollmentRepo.findAllProgressByStudent(studentId),
  submissionRepo.getStudentStats(studentId),          
  submissionRepo.findByStudentId(studentId, { skip: 0, limit: 10 }), 
  submissionRepo.getWeeklySubmissionCount(studentId), 
  submissionRepo.getPreviousWeekAverageScore(studentId), 
]);

    // Calculate score change vs previous week
    const currentAvgScore = Math.round(quizStats.avgScore || 0);
    const prevAvgScore = Math.round(prevWeekAvgScore || 0);
    const scoreChange = currentAvgScore - prevAvgScore;

    // Build course progress cards
    const courseProgressCards = allProgress.map((progress) => {
      const course = progress.course;
      const totalTopics = course?.topicCount || 0;
      const completedCount = progress.completedTopics?.length || 0;
      const percentage =
        totalTopics > 0
          ? Math.round((completedCount / totalTopics) * 100)
          : 0;

      return {
        courseId: course?._id,
        title: course?.title,
        icon: course?.icon,
        totalTopics,
        completedTopics: progress.completedTopics || [],
        completedCount,
        progressPercentage: percentage,
        lastAccessedTopic: progress.lastAccessedTopic,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Student dashboard loaded",
      data: {
        user: {
          username: req.user.username,
          avatarUrl: req.user.avatarUrl,
        },
        stats: {
          coursesEnrolled: enrollments.length,
          quizzesDone: quizStats.totalQuizzes,
          quizzesThisWeek: weeklyQuizCount,
          avgScore: currentAvgScore,
          scoreChange,
          learningStreak: req.user.learningStreak?.current || 0,
        },
        courseProgress: courseProgressCards,
        recentQuizActivity: recentSubmissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
//  GET /api/dashboard/admin
//  Protected — admin only
// ════════════════════════════════════════════════════════════
export const getAdminDashboard = async (req, res) => {
  try {
    /* ===========================
       DATE CALCULATIONS
    =========================== */

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    /* ===========================
       HEAVY AGGREGATIONS (PARALLEL)
    =========================== */

    const [
      totalQuestionsAgg,
      platformAvgScoreAgg,
      weeklyAttempts,
      topPerformingTopics,
    ] = await Promise.all([
      // total questions in all quizzes
      Quiz.aggregate([
        {
          $project: {
            questionCount: { $size: "$questions" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$questionCount" },
          },
        },
      ]),

      // platform average score
      submissionRepo.getPlatformAverageScore(),

      // weekly attempts
      submissionRepo.getWeeklySubmissionCount(),

      // top topics by performance
      submissionRepo.getTopQuizzes(5),
    ]);

    const totalQuestions = totalQuestionsAgg[0]?.total || 0;
    const platformAvgScore = Math.round(platformAvgScoreAgg || 0);

    /* ===========================
       SIMPLE COUNTS (PARALLEL)
    =========================== */

    const [
      totalUsers,
      activeToday,
      totalCourses,
      publishedCourses,
      totalTopics,
      totalQuizzes,
      totalAttempts,
      recentUsers,
    ] = await Promise.all([
      userRepo.countByRole("student"),
      userRepo.findActiveToday(),
      courseRepo.countAll(),
      courseRepo.countPublished(),
      topicRepo.countAll(),
      quizRepo.countAll(),
      submissionRepo.countTotal(),
      userRepo.findRecentRegistrations(10),
    ]);

    /* ===========================
       ENRICH RECENT USERS
    =========================== */

    const enrichedUsers = await Promise.all(
      recentUsers.map(async (user) => {
        const stats = await getStudentQuizStats(user._id);

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          joinedAt: user.createdAt,
          quizzesTaken: stats.totalQuizzes,
          avgScore: Math.round(stats.avgScore),
        };
      })
    );

    /* ===========================
       RESPONSE
    =========================== */

    return res.status(200).json({
      success: true,
      message: "Admin dashboard loaded successfully",
      data: {
        stats: {
          totalUsers,
          activeToday,
          activeTodayPercentage:
            totalUsers > 0
              ? Math.round((activeToday / totalUsers) * 100)
              : 0,

          totalCourses,
          publishedCourses,
          totalTopics,
          totalQuizzes,
          totalQuestions,

          totalAttempts,
          weeklyAttempts,

          avgScore: platformAvgScore,

          aiTutorSessions: 0, // future feature placeholder
        },

        topPerformingTopics,

        recentUsers: enrichedUsers,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message,
    });
  }
};