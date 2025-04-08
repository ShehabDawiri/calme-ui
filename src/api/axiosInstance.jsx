import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get token from cookies
const getToken = () => {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("auth_token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add Authorization header to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
// Error handling interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

const handleAxiosError = (error, functionName, url) => {
  console.error(
    `${functionName} failed (${url}):`,
    error.response?.data || error.message,
  );
};

// Universal POST request with data
export const sendData = async (endpoint, data) => {
  const url = `/${endpoint}`;
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "sendData", url);
  }
};

export default axiosInstance;
