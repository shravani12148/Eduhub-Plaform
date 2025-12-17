import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (status === 403) {
                console.error('Forbidden: You do not have permission');
            } else if (status === 404) {
                console.error('Resource not found');
            } else if (status >= 500) {
                console.error('Server error:', data.message || 'Internal server error');
            }
            
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error: Unable to reach server');
            return Promise.reject({
                message: 'Unable to connect to server. Please check your internet connection.'
            });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({
                message: error.message || 'An unexpected error occurred'
            });
        }
    }
);

export default api;