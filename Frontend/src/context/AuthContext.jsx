/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await authApi.getMe();
        setUser(data.data ? data.data.user : data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginWithToken = (userData, newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    if (typeof password === 'string' && email && typeof email === 'object') {
       return loginWithToken(email, password);
    }
    const res = await authApi.login(email, password);
    const newToken = res.data?.accessToken || res.data?.data?.token;
    const newUser = res.data?.user || res.data?.data?.user;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback(async (data) => {
    const res = await authApi.register(data);
    const newToken = res.data?.accessToken || res.data?.data?.token;
    const newUser = res.data?.user || res.data?.data?.user;
    if (newToken) {
       localStorage.setItem("token", newToken);
       setToken(newToken);
       setUser(newUser);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (authApi.logout) await authApi.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateUser = (updates) =>
    setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isStudent: user?.role === "student",
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
