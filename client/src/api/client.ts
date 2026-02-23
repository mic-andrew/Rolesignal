/**
 * Shared Axios instance for all API calls.
 * This is the only file that knows the base URL.
 */

import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export default client;
