// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';

// Configure axios defaults
import axios from 'axios';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
  }
  
  return config;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    };

    console.error('API Error:', errorDetails);

    if (!error.response && error.message === 'Network Error') {
      console.error('Possible CORS or server connectivity issue');
    }

    return Promise.reject(error);
  }
);

// Export the axios instance
export const api = axiosInstance;

export const getApiUrl = (endpoint) => {
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  const cleanEndpoint = endpoint
    .replace(/^\/+|\/+$/g, '')     // Remove leading/trailing slashes
    .replace(/^api\/+/, '');       // Remove api/ prefix if present
  
  return cleanEndpoint; // Return just the endpoint since baseURL is configured in axios instance
};

// Helper function to make API calls
export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = getApiUrl(endpoint);
    const response = await api.request({
      url,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}; 