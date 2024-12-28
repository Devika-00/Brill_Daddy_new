import axios from 'axios';

export const SERVER_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const CLOUDINARY_UPLOAD_API = "https://api.cloudinary.com/v1_1/dbl7wgz51/upload";
export const cloudinaryUploadPreset = "ml_default";

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

export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const response = await axiosInstance.request({
      url,
      ...options,
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    if (!error.response) {
      console.error(`Network issue for ${endpoint}:`, error);
      if (endpoint.includes('products') || endpoint.includes('vouchers') || endpoint.includes('carousel')) {
        return [];
      }
    }
    throw error;
  }
}; 