import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api, { TOKEN_KEY } from "../api/client";

const AuthContext = createContext(null);
const USER_KEY = "staffsync_user";

const readUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const dashboardPath = (role) => {
  if (!role) return "/login";
  const r = role.toLowerCase();
  if (r === "hr") return "/hr";
  if (r === "manager") return "/manager";
  return "/employee";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (localStorage.getItem(TOKEN_KEY) ? readUser() : null));

  const persist = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return persist(res.data);
  }, []);

  const register = useCallback(async (body) => {
    const res = await api.post("/auth/register", body);
    return persist(res.data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
