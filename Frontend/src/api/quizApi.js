import api from "./axios";

export const getQuizzes = () =>
  api.get("/quizzes");

export const getQuizById = (id) =>
  api.get(`/quizzes/${id}`);

export const submitQuiz = (id, answers) =>
  api.post(`/quizzes/${id}/submit`, { answers });
