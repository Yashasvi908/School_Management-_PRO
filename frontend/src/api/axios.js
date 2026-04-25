import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api'; // Use relative path for production or env var

const api = axios.create({
    baseURL,
    withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
