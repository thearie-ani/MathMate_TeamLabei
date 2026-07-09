import api from "./axios.js";

export const dashboardApi = {
  getStudentDashboard: () => api.get("/dashboard/student"),
  getAdminDashboard: () => api.get("/dashboard/admin"),
};