// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5002';

// Configure axios defaults
import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

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
    // More detailed error logging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });
    return Promise.reject(error);
  }
);

export const getApiUrl = (endpoint) => {
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  const cleanEndpoint = endpoint
    .replace(/^\/+|\/+$/g, '')     // Remove leading/trailing slashes
    .replace(/^api\/+/, '');       // Remove api/ prefix if present
  
  return `${SERVER_URL}/${cleanEndpoint}`;
}; 