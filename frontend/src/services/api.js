import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login page
      const isAuthCheck = error.config.url.includes('/auth/me');
      if (!isAuthCheck && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// User Profile Services
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
};

// Questions Services (Admin & General)
export const questionAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

// MCQ Services
export const mcqAPI = {
  getMCQs: (params) => api.get('/mcq', { params }),
  submitMCQ: (data) => api.post('/mcq/submit', data),
};

// Coding Services
export const codingAPI = {
  getAll: (params) => api.get('/coding', { params }),
  getById: (id) => api.get(`/coding/${id}`),
  create: (data) => api.post('/coding', data),
  update: (id, data) => api.put(`/coding/${id}`, data),
  delete: (id) => api.delete(`/coding/${id}`),
  submitCode: (data) => api.post('/coding/submit', data),
};

// Interview Services
export const interviewAPI = {
  create: (data) => api.post('/interviews', data),
  getAll: () => api.get('/interviews'),
  getById: (id) => api.get(`/interviews/${id}`),
  submitAnswer: (id, data) => api.post(`/interviews/${id}/answer`, data),
  complete: (id) => api.post(`/interviews/${id}/complete`),
};

// AI Evaluation Standalone
export const aiAPI = {
  evaluate: (data) => api.post('/ai/evaluate', data),
};

// Dashboard Stats
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
