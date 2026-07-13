import api from "./axios.js";

export const courseApi = {
  // Public
  getAllCourses: (params) => api.get("/courses", { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getTopicsByCourse: (courseId) => api.get(`/courses/${courseId}/topics`),
  getTopicById: (topicId) => api.get(`/courses/topics/${topicId}`),

  // Student
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  getMyCourses: () => api.get("/courses/my-courses"),
  completeTopic: (topicId) =>
    api.post(`/courses/topics/${topicId}/complete`),
  getCourseProgress: (courseId) =>
    api.get(`/courses/${courseId}/progress`),
  getMyProgress: () => api.get("/courses/progress/me"),

  // Admin
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  createTopic: (courseId, data) =>
    api.post(`/courses/${courseId}/topics`, data),
  updateTopic: (topicId, data) =>
    api.put(`/courses/topics/${topicId}`, data),
  deleteTopic: (topicId) => api.delete(`/courses/topics/${topicId}`),
};