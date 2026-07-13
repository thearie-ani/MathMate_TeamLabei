import api from "./axios";

export const getLessons = () =>
  api.get("/lessons");

export const getLessonById = (id) =>
  api.get(`/lessons/${id}`);
