import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await api.put('/admin/profile', profileData);
  return response.data;
};

export const changeAdminPassword = async (passwordData) => {
  const response = await api.put('/admin/change-password', passwordData);
  return response.data;
};

// Reviews & Stats
export const getReviewStats = async () => {
  const response = await api.get('/reviews/stats');
  return response.data;
};

export const getReviews = async (params = {}) => {
  const response = await api.get('/reviews', { params });
  return response.data;
};

export const updateReviewStatus = async (id, status) => {
  const response = await api.patch(`/reviews/${id}/status`, { status });
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

// Export Reviews as Blob for CSV / XLSX direct download
export const downloadReviewExport = async (format = 'csv', params = {}) => {
  const token = localStorage.getItem('adminToken');
  const response = await api.get('/reviews/export', {
    params: { format, ...params },
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pillowala-reviews-${timestamp}.${format}`;

  const blob = new Blob([response.data], {
    type:
      format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8;',
  });

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

// Products
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const scrapeProduct = async (url, autoSave = false, categoryId = '') => {
  const response = await api.post('/products/scrape', { url, autoSave, categoryId });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Categories
export const getCategories = async (params = {}) => {
  const response = await api.get('/categories', { params });
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Offers
export const getOffers = async (params = {}) => {
  const response = await api.get('/offers', { params });
  return response.data;
};

export const createOffer = async (data) => {
  const response = await api.post('/offers', data);
  return response.data;
};

export const updateOffer = async (id, data) => {
  const response = await api.patch(`/offers/${id}`, data);
  return response.data;
};

export const deleteOffer = async (id) => {
  const response = await api.delete(`/offers/${id}`);
  return response.data;
};

// Image Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Lucky Draw Management
export const getAdminLuckyDrawEligible = async (month) => {
  const response = await api.get('/luckydraw/admin/eligible', { params: { month } });
  return response.data;
};

export const conductAdminLuckyDraw = async (data) => {
  const response = await api.post('/luckydraw/admin/draw', data);
  return response.data;
};

export const toggleLuckyDrawPublish = async (id) => {
  const response = await api.patch(`/luckydraw/admin/${id}/publish`);
  return response.data;
};

export const deleteLuckyDraw = async (id) => {
  const response = await api.delete(`/luckydraw/admin/${id}`);
  return response.data;
};

export const getLuckyDrawHistory = async () => {
  const response = await api.get('/luckydraw/history');
  return response.data;
};

export default api;
