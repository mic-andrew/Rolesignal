/**
 * Shared Axios instance for all API calls.
 * This is the only file that knows the base URL.
 */

import axios from "axios";
import { useUIStore } from "../stores/uiStore";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("rs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler — every API error shows a toast
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;
    const path = window.location.pathname;
    const isPublicRoute = path === "/auth" || path.startsWith("/i/");
    const toast = useUIStore.getState().showToast;

    if (status === 401 && !isPublicRoute) {
      localStorage.removeItem("rs_token");
      toast("Session expired. Please sign in again.", "error");
      setTimeout(() => { window.location.href = "/auth"; }, 500);
    } else if (status === 403) {
      toast("You don't have permission to do that.", "error");
    } else if (status === 404) {
      toast(detail || "The requested resource was not found.", "error");
    } else if (status === 410) {
      toast(detail || "This resource is no longer available.", "error");
    } else if (status === 422) {
      const validationErrors = error.response?.data?.detail;
      const msg = Array.isArray(validationErrors)
        ? validationErrors.map((e: { msg: string }) => e.msg).join(", ")
        : detail || "Invalid data submitted.";
      toast(msg, "error");
    } else if (status && status >= 500) {
      toast("Something went wrong on our end. Please try again.", "error");
    } else if (error.code === "ECONNABORTED") {
      toast("Request timed out. Please check your connection.", "error");
    } else if (!error.response) {
      toast("Network error. Please check your connection.", "error");
    }

    return Promise.reject(error);
  },
);

export default client;
