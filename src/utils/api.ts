import axios from "axios";

const api = axios.create({
  baseURL: "https://forum-api.dicoding.dev/v1", // process.env.REACT_APP_API_BASE_URL,
  withCredentials: false, // true = send cookies
});

// Set up an interceptor to include token in requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    return Promise.reject(error);
  }
);

export default api;
