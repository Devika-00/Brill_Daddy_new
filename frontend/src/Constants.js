const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiUrl = (endpoint) => {
  // Remove any leading slashes from endpoint
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  // Remove /api prefix if it exists in endpoint
  const cleanedEndpoint = cleanEndpoint.replace(/^api\//, '');
  
  // Construct final URL
  return `${API_URL}/api/${cleanedEndpoint}`;
};

export const SERVER_URL = API_URL;

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
  async error => {
    const { config, message } = error;
    
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    
    config.retry -= 1;
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error occurred. Retrying...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return axios(config);
    }
    
    return Promise.reject(error);
  }
); 