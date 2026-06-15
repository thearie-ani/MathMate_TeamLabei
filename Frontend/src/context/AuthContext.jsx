/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (data) => {
    await api.post("/auth/register", data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
