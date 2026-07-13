import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import DashboardPage from "../pages/DashboardPage";
import AITutorPage from "../pages/AITutorPage";
import LessonsPage from "../pages/LessonsPage";
import LessonDetailPage from "../pages/LessonDetailPage";
import QuizListPage from "../pages/QuizListPage";
import QuizDetailPage from "../pages/QuizDetailPage";
import ProfilePage from "../pages/ProfilePage";


import AdminLayout from '../components/layout/adminLayour.jsx';
import CourseListPage from '../pages/admin/coursesPage.jsx';
import CourseFormPage from '../pages/admin/CourseFormPage';
import CoursePreviewPage from '../pages/admin/coursePreviewPage.jsx';
import TopicListPage from '../pages/admin/topicsPage.jsx';
import TopicFormPage from '../pages/admin/TopicFormPage';
import TopicPreviewPage from '../pages/admin/TopicPreviewPage';
import AdminDashboardPage from '../pages/admin/dashboardPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* HOME ROUTE */}
      <Route path="/" element={<HomePage />} />

      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* PROTECTED APP ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quizzes/:id" element={<QuizDetailPage />} />
        <Route path="/ai-tutor" element={<AITutorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="courses" element={<CourseListPage />} />
          <Route path="courses/new" element={<CourseFormPage />} />
          <Route path="courses/:id/edit" element={<CourseFormPage />} />
          <Route path="courses/:id/preview" element={<CoursePreviewPage />} />
          <Route path="topics" element={<TopicListPage />} />
          <Route path="topics/new" element={<TopicFormPage />} />
          <Route path="topics/:id/edit" element={<TopicFormPage />} />
          <Route path="topics/:id/preview" element={<TopicPreviewPage />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
