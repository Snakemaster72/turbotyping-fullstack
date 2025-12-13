import axios from 'axios';

const axiosInstance = axios.create();

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const userStr = localStorage.getItem('user');
        console.log('localStorage user:', userStr);
        
        const token = userStr ? JSON.parse(userStr).token : null;
        console.log('Token found:', !!token);
            
        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Adding auth header:', config.headers.Authorization);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
