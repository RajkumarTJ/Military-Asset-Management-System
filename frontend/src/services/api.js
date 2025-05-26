import axios from 'axios';

const API_URL = 'https://military-asset-management-system-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// API functions for different operations
export const authAPI = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => api.get('/api/auth/me'),
};

export const purchaseAPI = {
    create: (data) => api.post('/api/purchases', data),
    getAll: () => api.get('/api/purchases'),
    getByBase: (baseName) => api.get(`/api/purchases/${baseName}`),
};

export const transferAPI = {
    create: (data) => api.post('/api/transfers', data),
    getAll: () => api.get('/api/transfers'),
    getByBase: (baseName) => api.get(`/api/transfers/${baseName}`),
};

export const assignmentAPI = {
    create: (data) => api.post('/api/assignments', data),
    getAll: () => api.get('/api/assignments'),
    getByBase: (baseName) => api.get(`/api/assignments/${baseName}`),
};

export const assetAPI = {
    getAll: () => api.get('/api/assets'),
    getByBase: (baseName) => api.get(`/api/assets/${baseName}`),
    updateBalance: (id, data) => api.put(`/api/assets/${id}/balance`, data),
};
