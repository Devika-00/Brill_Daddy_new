import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';

export const SERVER_URL = isDevelopment ? '/api' : import.meta.env.VITE_API_URL;
export const SOCKET_URL = isDevelopment 
  ? `ws://localhost:${import.meta.env.VITE_PORT}` 
  : import.meta.env.VITE_SOCKET_URL;

export const CLOUDINARY_UPLOAD_API = "https://api.cloudinary.com/v1_1/dbl7wgz51/upload";
export const cloudinaryUploadPreset = "ml_default";

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
      if (error.response.status === 404) {
        return [];
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
      if (error.config.url.includes('products') || 
          error.config.url.includes('vouchers') || 
          error.config.url.includes('carousel')) {
        return [];
      }
    }
    return Promise.reject(error);
  }
);

export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const response = await axiosInstance.request({
      url,
      ...options
    });
    return response;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    if (!error.response) {
      console.error(`Network Error for ${endpoint}:`, error);
      if (endpoint.includes('products') || 
          endpoint.includes('vouchers') || 
          endpoint.includes('carousel')) {
        return [];
      }
    }
    throw error;
  }
}; 