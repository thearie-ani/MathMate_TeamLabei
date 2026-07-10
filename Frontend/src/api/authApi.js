import { delay, getStoredAuth, setStoredAuth, clearStoredAuth } from "./mockApi";

export const login = async (email, password) => {
  const user = {
    id: 1,
    name: email?.split("@")[0] || "Student",
    email,
    role: "student",
    xp: 2450,
    level: 5,
    achievements: [
      { name: "First Quiz", icon: "🏁", unlocked: true, description: "Completed the first quiz." },
      { name: "Daily Streak", icon: "🔥", unlocked: true, description: "Practiced two days in a row." },
      { name: "Focus Mode", icon: "🎯", unlocked: false, description: "Stayed focused for 30 minutes." },
    ],
  };

  const auth = { user, token: `mock-token-${Date.now()}` };
  setStoredAuth(auth);
  return delay({ data: auth });
};

export const register = async (data) => {
  const user = {
    id: 1,
    name: data?.name || "Student",
    email: data?.email || "student@example.com",
    role: "student",
    xp: 0,
    level: 1,
    achievements: [],
  };

  const auth = { user, token: `mock-token-${Date.now()}` };
  setStoredAuth(auth);
  return delay({ data: auth });
};

export const logout = async () => {
  clearStoredAuth();
  return delay({ data: { success: true } });
};

export const getMe = async () => {
  const auth = getStoredAuth();
  return delay({ data: auth?.user ?? null });
};
