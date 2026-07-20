import api from "./axios.js";

export const quizApi = {
  // Public
  getAllQuizzes: (params) => api.get("/quizzes", { params }),
  getQuizById: (id) => api.get(`/quizzes/${id}`),

  // Student
  getMyQuizHistory: (params) =>
    api.get("/quizzes/history/me", { params }),

  submitQuiz: (id, answers) =>
    api.post(`/quizzes/${id}/submit`, { answers }),

  retakeQuiz: (id, answers) =>
    api.post(`/quizzes/${id}/retake`, { answers }),

  getMySubmission: (id) =>
    api.get(`/quizzes/${id}/submissions/me`),

  // Admin
  getQuizHistory: (params) =>
    api.get("/quizzes/history", { params }),

  getStudentQuizHistory: (studentId, params) =>
    api.get(`/quizzes/history/${studentId}`, { params }),

  createQuiz: (data) =>
    api.post("/quizzes", data),

  updateQuiz: (id, data) =>
    api.put(`/quizzes/${id}`, data),

  deleteQuiz: (id) =>
    api.delete(`/quizzes/${id}`),

  getAllSubmissionsByQuiz: (id) =>
    api.get(`/quizzes/${id}/submissions`),
};