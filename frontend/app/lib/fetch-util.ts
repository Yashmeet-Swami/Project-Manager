import axios from "axios";

// Base URL from .env or fallback
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch logout event for global listener
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

// Helpers

export const postData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.post<T>(path, data);
  return response.data;
};

export const fetchData = async <T>(path: string): Promise<T> => {
  const response = await api.get<T>(path);
  return response.data;
};

export const updateData = async <T>(path: string, data: unknown): Promise<T> => {
  const response = await api.put<T>(path, data);
  return response.data;
};

export const deleteData = async <T>(path: string): Promise<T> => {
  const response = await api.delete<T>(path);
  return response.data;
};

export default api;
