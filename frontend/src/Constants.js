// Base URLs
export const SERVER_URL = import.meta.env.VITE_API_URL || 'https://api.brilldaddy.com/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'wss://api.brilldaddy.com';

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

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Helper function to handle network errors
const handleNetworkError = (error, endpoint) => {
  if (!error.response) {
    console.error(`CORS or Network issue for ${endpoint}:`, error);
    return [];
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