// import api from "./axios.js";

// export const dashboardApi = {
//   getStudentDashboard: () => api.get("/dashboard/student"),
//   getAdminDashboard: () => api.get("/dashboard/admin"),
// };



import api from "./axios.js";

export const getStudentDashboard = async () => {
  const { data } = await api.get("/dashboard/student");
  return data.data;
};

export const getAdminDashboard = async () => {
  const { data } = await api.get("/dashboard/admin");
  return data.data;
};

export const dashboardApi = {
  getStudentDashboard,
  getAdminDashboard,
};