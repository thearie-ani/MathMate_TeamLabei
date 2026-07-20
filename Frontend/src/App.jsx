import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./routes/protectedRoute.jsx";
import { GuestRoute } from "./routes/guestRoute.jsx";
import "katex/dist/katex.min.css";
// Home
import HomePage from "./pages/home/HomePage.jsx";

// Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/resetPassword.jsx";
import VerifyEmailPage from "./pages/auth/verifyEmailPage.jsx";

import CoursePage from "./pages/student/coursePage.jsx";
import LessonPage from "./pages/student/lessonPage.jsx";

import AdminLayout from "./components/layout/adminLayour.jsx";
import AdminImportPage from "./pages/admin/importPage.jsx";
import CourseListPage from "./pages/admin/coursesPage.jsx";
import CourseFormPage from "./pages/admin/CourseFormPage";
import CoursePreviewPage from "./pages/admin/coursePreviewPage.jsx";
import LessonListPage from "./pages/admin/lessonsPage.jsx";
import LessonFormPage from "./pages/admin/lessonFormPage.jsx";
import LessonPreviewPage from "./pages/admin/lessonPreviewPage.jsx";
import QuizzesPage from "./pages/admin/quizesPage.jsx";
import QuizFormPage from "./pages/admin/quizFormPage.jsx";
import QuizPreviewPage from "./pages/admin/quizPreviewPage.jsx";
import SubmissionsPage from "./pages/admin/submissionPage.jsx";

import AdminUsersPage from "./pages/admin/userPage.jsx";
import UserDetailPage from "./pages/admin/userDetailPage.jsx";

import DashboardPage from "./pages/admin/dashboardPage.jsx";
import { Home } from "lucide-react";
import StudentLayout from "./components/layout/studenLayour.jsx";
import CoursesPage from "./pages/student/coursesPage.jsx";

//ai tutor info
import AiTutorPage from "./pages/student/aiTutorPage.jsx";
//student's dashbaord
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
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
            <Route path="/" element={<HomePage />} />

            {/* ── Guest only ───────────────────── */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="/courses" element={<CoursesPage/>} />
              </Route>
              <Route path="/courses/:slug" element={<CoursePage />} />
              <Route path="/courses/:slug/lessons/:lessonSlug" element={<LessonPage />} />
              <Route element={<StudentLayout />}>
                <Route path="/courses" element={<CoursesPage/>} />
                <Route path="/ai-tutor" element={<AiTutorPage/>} />   {/* new */}
              </Route>              
            </Route>

            <Route
              path="/admin"
              element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardPage />} />

                <Route path="import" element={<AdminImportPage />} />
                
                <Route path="courses" element={<CourseListPage />} />
                <Route path="courses/new" element={<CourseFormPage />} />
                <Route path="courses/:id/edit" element={<CourseFormPage />} />
                <Route
                  path="courses/:id/preview"
                  element={<CoursePreviewPage />}
                />

                <Route path="courses/:id/lessons" element={<LessonListPage />} />
                <Route path="lessons/new" element={<LessonFormPage />} />
                <Route path="lessons/:id/edit" element={<LessonFormPage />} />
                <Route
                  path="lessons/:id/preview"
                  element={<LessonPreviewPage />}
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
