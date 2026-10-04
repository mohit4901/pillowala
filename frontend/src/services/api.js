import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

// Products
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCategoryById = async (idOrSlug) => {
  const response = await api.get(`/categories/${idOrSlug}`);
  return response.data;
};

// Offers
export const getOffers = async () => {
  const response = await api.get('/offers');
  return response.data;
};

// Reviews
export const getApprovedReviews = async (params = {}) => {
  const response = await api.get('/reviews', {
    params: { status: 'approved', ...params },
  });
  return response.data;
};

export const submitReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const checkOrderIdAvailability = async (orderId) => {
  const response = await api.get(`/reviews/check-order/${encodeURIComponent(orderId)}`);
  return response.data;
};

// Image Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Lucky Draw
export const getCurrentLuckyDraw = async () => {
  const response = await api.get('/luckydraw/current');
  return response.data;
};

export const getLuckyDrawHistory = async () => {
  const response = await api.get('/luckydraw/history');
  return response.data;
};

// Sleep Test Matching
export const matchSleepSurvey = async (surveyData) => {
  const response = await api.post('/products/sleep-match', surveyData);
  return response.data;
};

export default api;
