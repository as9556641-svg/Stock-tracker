import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://stock-tracker-xiq7.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000,
  withCredentials: false
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (error.message === "Network Error") {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  return fallbackMessage;
};

export const retryRequest = async (requestFactory, options = {}) => {
  const {
    retries = 2,
    retryDelayMs = 2500,
    shouldRetry = () => true
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFactory();
    } catch (error) {
      lastError = error;

      if (attempt === retries || !shouldRetry(error, attempt)) {
        break;
      }

      await delay(retryDelayMs * (attempt + 1));
    }
  }

  throw lastError;
};

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  signup: (payload) => api.post("/auth/signup", payload),
  register: (payload) => api.post("/auth/signup", payload)
};

export const stockApi = {
  getLivePrice: (symbol) => api.get(`/stock-price/${encodeURIComponent(symbol)}`)
};

export default api;
