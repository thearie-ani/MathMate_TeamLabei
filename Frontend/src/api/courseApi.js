import api from "./axios.js";

export const courseApi = {
  // Public / guest-visible (filtered by role server-side)
  getAllCourses: (params) => api.get("/courses", { params }),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  getCourseBySlug: (slug) => api.get(`/courses/slug/${slug}`),
  getLessonsByCourse: (courseId) => api.get(`/courses/${courseId}/lessons`),
  getLessonById: (lessonId) => api.get(`/courses/lessons/${lessonId}`),

  // Student
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getMyCourses: () => api.get("/courses/my-courses"),
  completeLesson: (lessonId) => api.post(`/courses/lessons/${lessonId}/complete`),
  getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
  getMyProgress: () => api.get("/courses/progress/me"),
  getLessonStatus: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/status`),

  // Admin
  createCourse: (data) => {
    console.log("Create: ", data);
    return api.post("/courses", data)}
  ,
  updateCourse: (courseId, data) => api.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
  createLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  updateLesson: (lessonId, data) => api.put(`/courses/lessons/${lessonId}`, data),
  deleteLesson: (lessonId) => api.delete(`/courses/lessons/${lessonId}`),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api
      .post("/uploads/image", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data.data);
  },

  importFromOpenstax :(url) => api.post("/import/openstax", { url }).then((r) => r.data.data)

};