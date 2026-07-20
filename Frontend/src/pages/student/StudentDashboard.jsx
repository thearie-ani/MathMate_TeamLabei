import { Link } from "react-router-dom";
import {
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";

function StatCard({ icon: Icon, label, value, sub, subColor }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur border border-pink-100 shadow-sm p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-purple-700" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className={`text-xs mt-0.5 ${subColor}`}>{sub}</p>}
      </div>
    </div>
  );
}

function CourseProgressCard({ course }) {
  const continueHref = course.lastAccessedLesson
    ? `/courses/${course.courseId}/lessons/${course.lastAccessedLesson}`
    : `/courses/${course.courseId}`;

  return (
    <div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4 flex flex-col gap-3">
      <div>
        <p className="font-medium text-gray-800 truncate">{course.title}</p>
        <p className="text-xs text-gray-500">
          {course.completedCount}/{course.totalLessons} lessons
        </p>
      </div>

      <div className="w-full h-2 rounded-full bg-pink-50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
          style={{ width: `${course.progressPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {course.progressPercentage}% complete
        </span>
        <Link
          to={continueHref}
          className="text-xs font-medium text-purple-600 flex items-center gap-1 hover:text-purple-800"
        >
          Continue <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function RecentActivityRow({ item }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-pink-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {item.quiz?.title}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {item.course?.title} • {item.lesson?.title}
        </p>
      </div>
      <span
        className={`text-sm font-semibold shrink-0 ml-3 ${
          item.score >= 70 ? "text-green-600" : "text-orange-500"
        }`}
      >
        {item.score}%
      </span>
    </div>
  );
}

export default function StudentDashboard() {
  const { data, isLoading, isError, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading dashboard…</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard: {error?.message}
      </div>
    );
  }

  const { user, stats, courseProgress, recentQuizActivity } = data;
  const scoreUp = stats.scoreChange >= 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl || "/placeholder-avatar.png"}
          alt={user.username}
          className="h-12 w-12 rounded-full object-cover border-2 border-pink-200"
        />
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome back, {user.username}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-400" />
            {stats.learningStreak}-day streak
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Courses enrolled"
          value={stats.coursesEnrolled}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Quizzes done"
          value={stats.quizzesDone}
          sub={`${stats.quizzesThisWeek} this week`}
          subColor="text-gray-400"
        />
        <StatCard
          icon={scoreUp ? TrendingUp : TrendingDown}
          label="Average score"
          value={`${stats.avgScore}%`}
          sub={`${scoreUp ? "+" : ""}${stats.scoreChange}% vs last week`}
          subColor={scoreUp ? "text-green-600" : "text-red-500"}
        />
        <StatCard
          icon={Flame}
          label="Learning streak"
          value={`${stats.learningStreak} days`}
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Your courses
        </h2>
        {courseProgress.length === 0 ? (
          <p className="text-sm text-gray-500">
            No enrolled courses yet.{" "}
            <Link to="/courses" className="text-purple-600 font-medium">
              Browse courses
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseProgress.map((c) => (
              <CourseProgressCard key={c.courseId} course={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Recent quiz activity
        </h2>
        <div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4">
          {recentQuizActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No quiz attempts yet.</p>
          ) : (
            recentQuizActivity.map((item) => (
              <RecentActivityRow key={item._id} item={item} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}