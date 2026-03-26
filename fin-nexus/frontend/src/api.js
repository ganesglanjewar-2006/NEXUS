import axios from 'axios';

// Always use relative URL (empty string = current origin)
// In development: Vite's proxy forwards /api/* to localhost:5002
// In production: requests go directly to the Vercel serverless function at the same domain
const API = axios.create({
    baseURL: '',
    timeout: 15000,
});

// Automatically add the JWT token to every request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
