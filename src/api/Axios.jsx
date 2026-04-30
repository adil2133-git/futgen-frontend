import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL + "/api",
  withCredentials: true
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      if (originalRequest.url.includes("/users/login")) {
        return Promise.reject(error);
      }
      if (!isRedirecting) {
        isRedirecting = true;
        toast.error("Your account has been blocked by admin");
        setTimeout(() => {
          isRedirecting = false;
          window.location.href = "/login";
        }, 1000);
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
        if (!isRedirecting) {
          isRedirecting = true;
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;