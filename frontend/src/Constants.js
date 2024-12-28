// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5002';

export const getApiUrl = (endpoint) => {
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  // Remove leading/trailing slashes and clean up endpoint
  const cleanEndpoint = endpoint
    .replace(/^\/+|\/+$/g, '')     // Remove leading/trailing slashes
    .replace(/^api\/+/, '');       // Remove api/ prefix if present
  
  // Return the full URL without adding extra /api prefix since it's already in SERVER_URL
  return `${SERVER_URL}/${cleanEndpoint}`;
};

// Configure axios defaults
import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;

// Add request interceptor to log requests in development
axios.interceptors.request.use(config => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
  }
  return config;
});

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
); 