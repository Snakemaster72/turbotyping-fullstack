import axios from 'axios';

// Use environment variable in production, empty string in development (uses proxy)
const baseURL = import.meta.env.VITE_API_URL || '';

const axiosInstance = axios.create({
  baseURL: baseURL
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const userStr = localStorage.getItem('user');
        
        const token = userStr ? JSON.parse(userStr).token : null;
            
        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
