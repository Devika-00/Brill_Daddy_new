// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Configure axios defaults
import axios from 'axios';
import io from 'socket.io-client';

// Create socket instance
export const socket = io(SOCKET_URL.replace('/socket.io', ''), {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

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

// Add response interceptor with better error handling
axiosInstance.interceptors.response.use(
  response => {
    // Ensure we're returning an array for endpoints that expect arrays
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      return response.data;
    }
    return [];
  },
  error => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };

    console.error('API Error:', errorDetails);
    return Promise.reject(error);
  }
);

// Helper function to make API calls with better error handling
export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = endpoint.replace(/^\/+/, '');
    const response = await api.request({
      url,
      ...options
    });
    
    // Ensure we return an array for endpoints that expect arrays
    if (endpoint.includes('products') || endpoint.includes('vouchers') || endpoint.includes('carousel')) {
      return Array.isArray(response) ? response : [];
    }
    
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    // Return empty array for endpoints that expect arrays
    if (endpoint.includes('products') || endpoint.includes('vouchers') || endpoint.includes('carousel')) {
      return [];
    }
    throw error;
  }
};

// Export the axios instance
export const api = axiosInstance;

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