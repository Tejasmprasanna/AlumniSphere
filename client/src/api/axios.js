import axios from "axios";

import toast from "react-hot-toast";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Attach JWT token automatically to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("alumniToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response interceptor to handle errors systematically
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "An unexpected error occurred.";
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            // Handle unauthorized access by clearing token and redirecting
            toast.error("Session expired or access denied. Please log in again.");
            localStorage.removeItem("alumniToken");

            // Only redirect if not already on public routes
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/register" && path !== "/" && !path.startsWith("/public")) {
                window.location.href = "/login";
            }
        } else {
            // Show toast for all other errors
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default API;
