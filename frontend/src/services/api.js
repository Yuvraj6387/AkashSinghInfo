import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Job Services
export const jobService = {
  // Public endpoints
  getAllJobs: () => apiClient.get('/jobs'),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  searchJobs: (query, department) => 
    apiClient.get('/jobs/search', { params: { query, department } }),
  downloadPDF: (id) => apiClient.get(`/jobs/${id}/download`, { responseType: 'blob' }),

  // Admin endpoints
  createJob: (formData) => apiClient.post('/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateJob: (id, formData) => apiClient.put(`/jobs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteJob: (id) => apiClient.delete(`/jobs/${id}`),
};

// Admin Services
export const adminService = {
  login: (username, password) => 
    apiClient.post('/admin/login', { username, password }),
  logout: () => apiClient.post('/admin/logout'),
  verifyToken: () => apiClient.get('/admin/verify'),
};

export default apiClient;
