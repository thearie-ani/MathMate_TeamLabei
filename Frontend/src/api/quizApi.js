import api from "./axios.js";

export const quizApi = {
  // Public
  getAllQuizzes: (params) => api.get("/quizzes", { params }),
  getQuizById: (id) => api.get(`/quizzes/${id}`),

  // Student
  getQuizHistory: (params) => api.get("/quizzes/history", { params }),
  submitQuiz: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  retakeQuiz: (id, answers) => api.post(`/quizzes/${id}/retake`, { answers }),
  getMySubmission: (id) => api.get(`/quizzes/${id}/submissions/me`),

  // Admin
  createQuiz: (data) => api.post("/quizzes", data),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getAllSubmissionsByQuiz: (id) => api.get(`/quizzes/${id}/submissions`),
};

export const getQuizzes = () =>
  api.get("/quizzes");

export const getQuizById = (id) =>
  api.get(`/quizzes/${id}`);

export const submitQuiz = (id, answers) =>
  api.post(`/quizzes/${id}/submit`, { answers });
