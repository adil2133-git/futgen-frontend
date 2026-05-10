import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;

    const publicRoutes = ["/login", "/signup", "/"];

    if (
      error.response?.status === 403 &&
      !publicRoutes.includes(currentPath) 
    ) {
      if (
        !originalRequest.url.includes("/users/login") &&
        !originalRequest.url.includes("/users/register")
      ) {
        if (!isRedirecting) {
          isRedirecting = true;
          toast.error("Your account has been blocked by admin");

          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      }

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh") &&
      !originalRequest.url.includes("/users/login")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;