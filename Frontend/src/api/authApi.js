import api from "./axios";

export const authApi = {
  login: (data) => api.post("/auth/login", data),

  register: (data) => api.post("/auth/register", data),

  getMe: () => api.get("/auth/me"),

  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),

  verifyEmail: (data) =>
    api.post(`/auth/verify-email`, data),

  resendVerificationEmail: (email) =>
    api.post("/auth/resend-verification", { email }),
};
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const register = (data) =>
  api.post("/auth/register", data);

export const logout = () =>
  api.post("/auth/logout");

export const getMe = () =>
  api.get("/auth/me");
