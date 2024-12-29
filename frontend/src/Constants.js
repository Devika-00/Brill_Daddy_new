// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Configure axios defaults
import axios from 'axios';
import io from 'socket.io-client';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Modify response interceptor
axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          return []; // Return empty array for not found
        default:
          console.error('API Error:', error.response);
      }
    }
    return Promise.reject(error);
  }
);

// Export the axios instance
export const api = axiosInstance;

// Create socket instance
export const socket = io(SOCKET_URL, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true
});

// Helper function to handle network errors
const handleNetworkError = (error, endpoint) => {
  if (!error.response) {
    console.error(`CORS or Network issue for ${endpoint}:`, error);
    if (endpoint.includes('products') || endpoint.includes('vouchers') || endpoint.includes('carousel')) {
      return [];
    }
  }
  throw error;
};

// Helper function to make API calls
export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const response = await api.request({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return handleNetworkError(error, endpoint);
  }
}; 