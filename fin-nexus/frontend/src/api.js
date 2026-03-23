import axios from 'axios';

// Create a centralized axios instance
// In development, it defaults to localhost:5002
// In production, it will use the current host (same as the backend)
const API = axios.create({
    baseURL: import.meta.env.PROD 
        ? '' // Same origin (monolithic deployment)
        : 'http://localhost:5002',
    timeout: 10000,
});

// Automatically add the token to every request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
