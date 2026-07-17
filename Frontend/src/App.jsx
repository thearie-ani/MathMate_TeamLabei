import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./routes/protectedRoute.jsx";
import { GuestRoute } from "./routes/guestRoute.jsx";

// Home
// import HomePage from "./pages/home/HomePage.jsx";

// Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
// import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
// import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import VerifyEmailPage from "./pages/auth/verifyEmailPage.jsx";

// // Student
// import StudentDashboardPage from "./pages/student/DashboardPage.jsx";
// import MyCoursesPage from "./pages/student/MyCoursesPage.jsx";
// import CourseDetailPage from "./pages/student/CourseDetailPage.jsx";
// import LessonPage from "./pages/student/LessonPage.jsx";
// import QuizzesPage from "./pages/student/QuizzesPage.jsx";
// import QuizDetailPage from "./pages/student/QuizDetailPage.jsx";
// import QuizResultPage from "./pages/student/QuizResultPage.jsx";
// import QuizHistoryPage from "./pages/student/QuizHistoryPage.jsx";
// import AITutorPage from "./pages/student/AITutorPage.jsx";
// import ProfilePage from "./pages/student/ProfilePage.jsx";

// // Admin
// import AdminDashboardPage from "./pages/admin/DashboardPage.jsx";
// import AdminCoursesPage from "./pages/admin/courses/CoursesPage.jsx";
// import AdminCourseFormPage from "./pages/admin/courses/CourseFormPage.jsx";
// import AdminCoursePreviewPage from "./pages/admin/courses/CoursePreviewPage.jsx";
// import AdminTopicsPage from "./pages/admin/topics/TopicsPage.jsx";
// import AdminTopicFormPage from "./pages/admin/topics/TopicFormPage.jsx";
// import AdminTopicPreviewPage from "./pages/admin/topics/TopicPreviewPage.jsx";
// import AdminQuizzesPage from "./pages/admin/quizzes/QuizzesPage.jsx";
// import AdminQuizFormPage from "./pages/admin/quizzes/QuizFormPage.jsx";
// import AdminQuizPreviewPage from "./pages/admin/quizzes/QuizPreviewPage.jsx";
// import AdminSubmissionsPage from "./pages/admin/quizzes/SubmissionsPage.jsx";
// import AdminUsersPage from "./pages/admin/users/UsersPage.jsx";
// import AdminUserDetailPage from "./pages/admin/users/UserDetailPage.jsx";

import AdminLayout from "./components/layout/adminLayour.jsx";
import CourseListPage from "./pages/admin/coursesPage.jsx";
import CourseFormPage from "./pages/admin/CourseFormPage";
import CoursePreviewPage from "./pages/admin/coursePreviewPage.jsx";
import TopicListPage from "./pages/admin/topicsPage.jsx";
import TopicFormPage from "./pages/admin/TopicFormPage";
import TopicPreviewPage from "./pages/admin/TopicPreviewPage";
import QuizzesPage from "./pages/admin/quizesPage.jsx";
import QuizFormPage from "./pages/admin/quizFormPage.jsx";
import QuizPreviewPage from "./pages/admin/quizPreviewPage.jsx";
import SubmissionsPage from "./pages/admin/submissionPage.jsx";

import AdminUsersPage from "./pages/admin/userPage.jsx";
import UserDetailPage from "./pages/admin/userDetailPage.jsx";

import DashboardPage from "./pages/admin/dashboardPage.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1928",
                color: "#fff",
                border: "1px solid #2d2b42",
              },
            }}
          />
          <Routes>
            {/* ── Public — no auth needed ──────── */}
            {/* <Route path="/" element={<HomePage />} /> */}

            {/* ── Guest only ───────────────────── */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>

            {/* ── Any logged in user ───────────── */}
            {/* Both student and admin can browse */}
            {/* <Route element={<ProtectedRoute allowedRoles={["student", "admin"]} />}>
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quizzes/:id" element={<QuizDetailPage />} />
            </Route> */}

            {/* ── Student only ─────────────────── */}
            {/* <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="/dashboard" element={<StudentDashboardPage />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/courses/:courseId/topics/:topicId" element={<LessonPage />} />
              <Route path="/quizzes/:id/result" element={<QuizResultPage />} />
              <Route path="/quizzes/history" element={<QuizHistoryPage />} />
              <Route path="/ai-tutor" element={<AITutorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route> */}

            {/* ── Admin only ───────────────────── */}
            {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/courses/new" element={<AdminCourseFormPage />} />
              <Route path="/admin/courses/:id/edit" element={<AdminCourseFormPage />} />
              <Route path="/admin/courses/:id/preview" element={<AdminCoursePreviewPage />} />
              <Route path="/admin/topics" element={<AdminTopicsPage />} />
              <Route path="/admin/topics/new" element={<AdminTopicFormPage />} />
              <Route path="/admin/topics/:id/edit" element={<AdminTopicFormPage />} />
              <Route path="/admin/topics/:id/preview" element={<AdminTopicPreviewPage />} />
              <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
              <Route path="/admin/quizzes/new" element={<AdminQuizFormPage />} />
              <Route path="/admin/quizzes/:id/edit" element={<AdminQuizFormPage />} />
              <Route path="/admin/quizzes/:id/preview" element={<AdminQuizPreviewPage />} />
              <Route path="/admin/quizzes/:id/submissions" element={<AdminSubmissionsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            </Route> */}
            <Route
              path="/admin"
              element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />

                <Route path="courses" element={<CourseListPage />} />
                <Route path="courses/new" element={<CourseFormPage />} />
                <Route path="courses/:id/edit" element={<CourseFormPage />} />
                <Route
                  path="courses/:id/preview"
                  element={<CoursePreviewPage />}
                />

                <Route path="topics" element={<TopicListPage />} />
                <Route path="topics/new" element={<TopicFormPage />} />
                <Route path="topics/:id/edit" element={<TopicFormPage />} />
                <Route
                  path="topics/:id/preview"
                  element={<TopicPreviewPage />}
                />

                <Route path="quizzes" element={<QuizzesPage />} />
                <Route path="quizzes/new" element={<QuizFormPage />} />
                <Route path="quizzes/:id/edit" element={<QuizFormPage />} />
                <Route
                  path="quizzes/:id/preview"
                  element={<QuizPreviewPage />}
                />
                <Route path="quizzes/:id/submissions" element={<SubmissionsPage />} />

                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
              </Route>
            </Route>

            {/* ── 404 ──────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
