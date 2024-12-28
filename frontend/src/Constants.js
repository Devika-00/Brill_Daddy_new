// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';

// Configure axios defaults
import axios from 'axios';

// Configure axios defaults
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to handle auth and logging
axios.interceptors.request.use(config => {
  // Get token from localStorage or your auth state
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add CORS headers
  config.headers['Access-Control-Allow-Credentials'] = true;
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
  }
  
  return config;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  error => {
    // More detailed error logging
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

    // Check if error is due to CORS
    if (!error.response && error.message === 'Network Error') {
      console.error('Possible CORS or server connectivity issue');
    }

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