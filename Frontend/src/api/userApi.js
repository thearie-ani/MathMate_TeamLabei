import api from "./axios.js";

export const userApi = {
  // Student
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.put("/users/me", data),
  changePassword: (data) => api.put("/users/me/password", data),
  updateAvatar: (formData) =>
    api.put("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteMe: (password) => api.delete("/users/me", { data: { password } }),

  // Admin
  getAllUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const getProfile = () =>
  api.get("/users/profile");

export const updateProfile = (data) =>
  api.put("/users/profile", data);
