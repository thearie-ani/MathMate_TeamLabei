import api from "./axios";

export const getStudentDashboard = async () => {
  const res = await api.get("/dashboard/student");
  return res.data.data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/dashboard/admin");
  return data.data;
};

export const dashboardApi = {
  getStudentDashboard,
  getAdminDashboard,
};