// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Configure axios defaults
import axios from 'axios';
import io from 'socket.io-client';

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

// Export the axios instance first so it can be used by other functions
export const api = axiosInstance;

// Create socket instance with proper error handling
export const socket = io(SOCKET_URL.replace('/socket.io', ''), {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

// Add request interceptor
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => {
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

// Helper function to make API calls
const handleNetworkError = (error, endpoint) => {
  if (!error.response && error.message === 'Network Error') {
    console.error(`CORS or Network issue for ${endpoint}:`, error);
    // You might want to add retry logic here
    return [];
  }
  throw error;
};

export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = endpoint.replace(/^\/+/, '');
    const response = await api.request({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (endpoint.includes('products') || endpoint.includes('vouchers') || endpoint.includes('carousel')) {
      return Array.isArray(response) ? response : [];
    }
    
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return handleNetworkError(error, endpoint);
  }
}; 