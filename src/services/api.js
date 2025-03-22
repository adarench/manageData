import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth Services
export const registerUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

// Date Services
export const getDates = async (filters = {}) => {
  const response = await api.get('/dates', { params: filters });
  return response.data;
};

export const getDateById = async (id) => {
  const response = await api.get(`/dates/${id}`);
  return response.data;
};

export const addDate = async (dateData) => {
  const response = await api.post('/dates', dateData);
  return response.data;
};

export const updateDate = async (id, dateData) => {
  const response = await api.put(`/dates/${id}`, dateData);
  return response.data;
};

export const deleteDate = async (id) => {
  const response = await api.delete(`/dates/${id}`);
  return response.data;
};

export const getDateInsights = async () => {
  const response = await api.get('/dates/insights');
  return response.data;
};

// Contact Services
export const getContacts = async (filters = {}) => {
  const response = await api.get('/contacts', { params: filters });
  return response.data;
};

export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

export const createContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

// Leaderboard Services
export const getLeaderboard = async () => {
  const response = await api.get('/users/leaderboard');
  return response.data;
};

// Request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
      
    // If token is expired or invalid, logout
    if (error.response?.status === 401) {
      // You can dispatch logout action here if using Redux
      // For now, just console log
      console.log('Authentication error:', message);
    }
    
    return Promise.reject(error);
  }
);

export default api;