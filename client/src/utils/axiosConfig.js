import axios from 'axios';

// Use environment variable in production, empty string in development (uses proxy)
const baseURL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
  baseURL: baseURL
});

// Request interceptor — attach JWT from localStorage to every request
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            // login now stores JSON.stringify({_id, username, email, token}) under "user".
            // The try/catch guards against any old session that stored a raw JWT string
            // (which is not valid JSON and would crash JSON.parse).
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // Stored value isn't valid JSON — skip auth header; response interceptor
            // will redirect to login if the server rejects the request.
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — catch 401s globally so every page gets automatic logout
// instead of each page handling auth failures individually.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const code = error.response.data?.error;
            // These are the structured codes returned by protect middleware.
            // TOKEN_EXPIRED means the JWT was valid but is now past its 30-day window.
            // TOKEN_INVALID / TOKEN_MISSING means something corrupt was sent.
            if (code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID" || code === "TOKEN_MISSING") {
                localStorage.removeItem("user");
                // Only redirect if not already on an auth page to avoid a redirect loop
                if (!window.location.pathname.startsWith("/auth")) {
                    window.location.href = "/auth/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
