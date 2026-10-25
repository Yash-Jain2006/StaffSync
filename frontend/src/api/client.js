import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

export const TOKEN_KEY = "staffsync_token";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid token -> clear session and send the user to login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("staffsync_user");
      if (location.pathname !== "/login") location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export const errMsg = (err) => err.response?.data?.message || err.message || "Something went wrong";

export default api;
