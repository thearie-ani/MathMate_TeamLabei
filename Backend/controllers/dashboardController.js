import * as userRepo from "../repository/userReposity.js";
import * as enrollmentRepo from "../repository/progressRepository.js";
import * as quizRepo from "../repository/quizRepository.js";
import * as courseRepo from "../repository/courseRepositoty.js";
import * as lessonRepo from "../repository/lessonRepository.js";
import * as submissionRepo from "../repository/submissionRepository.js";
import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js"; 
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
    .populate("lesson", "title")
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
const courseProgressCards = await Promise.all(
  allProgress.map(async (progress) => {

    const course = progress.course;

    const totalLessons = await Lesson.countDocuments({
      course: course._id
    });

    const completedCount =
      progress.completedLessons?.length || 0;


    const percentage =
      totalLessons > 0
        ? Math.round(
            (completedCount / totalLessons) * 100
          )
        : 0;


    return {
      courseId: course._id,
      slug: course.slug,
      title: course.title,
      thumbnail: course.thumbnail,
      lessonCount: totalLessons,
      completedLessons:
        progress.completedLessons || [],
      completedCount,
      progressPercentage: percentage,
      lastAccessedLesson:
        progress.lastAccessedLesson,
    };
  })
);

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
export const getAdminDashboard = async (req,res)=>{
  try {

    const [
      totalQuestionsAgg,
      platformAvgScoreAgg,
      weeklyAttempts,
      topPerformingTopics,

      totalUsers,
      activeToday,
      totalCourses,
      publishedCourses,
      totalLessons,
      totalQuizzes,
      totalAttempts,
      recentUsers

    ] = await Promise.all([

      Quiz.aggregate([
        {
          $project:{
            questionCount:{
              $size:"$questions"
            }
          }
        },
        {
          $group:{
            _id:null,
            total:{
              $sum:"$questionCount"
            }
          }
        }
      ]),

      submissionRepo.getPlatformAverageScore(),
      submissionRepo.getWeeklyAttemptCount(),
      submissionRepo.getTopQuizzes(5),
      userRepo.countByRole("student"),
      userRepo.findActiveToday(),
      courseRepo.countAll(),
      courseRepo.countPublished(),
      lessonRepo.countAll(),
      quizRepo.countAll(),
      submissionRepo.countTotal(),
      userRepo.findRecentRegistrations(10)

    ]);

    const totalQuestions =  totalQuestionsAgg[0]?.total || 0;

    const recentUsersData =
      await Promise.all(  recentUsers.map(async(user)=>{
          const stats = await getStudentQuizStats(user._id);

          return {
            id:user._id,
            username:user.username,
            email:user.email,
            joinedAt:user.createdAt,
            quizzesTaken:
              stats.totalQuizzes || 0,
            avgScore:
              Math.round(stats.avgScore || 0)

          };
        })
      );

    return res.status(200).json({
      success:true,
      data:{
        stats:{
          totalUsers,
          activeToday,
          activeTodayPercentage:
            totalUsers
            ?
            Math.round(
              activeToday / totalUsers * 100
            )
            :
            0,
          totalCourses,
          publishedCourses,
          totalLessons,
          totalQuizzes,
          totalQuestions,
          totalAttempts,
          weeklyAttempts,
          avgScore:
            Math.round(platformAvgScoreAgg || 0),
          aiTutorSessions:0
        },
        topPerformingTopics,
        recentUsers:
          recentUsersData,
        trend:[]
      }
    });
  }catch(error){
    console.error(error);
    res.status(500).json({
      success:false,
      message:error.message
    });
  }
}