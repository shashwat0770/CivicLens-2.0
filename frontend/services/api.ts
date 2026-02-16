import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://civiclens-2-0-1.onrender.com';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Complaint API
export const complaintAPI = {
    create: (data: FormData) => api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAll: (params?: any) => api.get('/complaints', { params }),
    getById: (id: string) => api.get(`/complaints/${id}`),
    update: (id: string, data: any) => api.put(`/complaints/${id}`, data),
    delete: (id: string) => api.delete(`/complaints/${id}`),
    assign: (id: string, authorityId: string) =>
        api.post(`/complaints/${id}/assign`, { authorityId }),
    addUpdate: (id: string, data: any) =>
        api.post(`/complaints/${id}/update-progress`, data),
    getForMap: (params?: any) => api.get('/complaints/map', { params }),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params?: any) => api.get('/admin/users', { params }),
    updateUserRole: (id: string, role: string) =>
        api.put(`/admin/users/${id}/role`, { role }),
    toggleUserStatus: (id: string) =>
        api.put(`/admin/users/${id}/toggle-status`),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
    getAuthorities: () => api.get('/admin/authorities'),
};
