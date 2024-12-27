const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SERVER_URL = API_URL;

// Add a helper function to construct API URLs with error handling
export const getApiUrl = (endpoint) => {
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  // Ensure endpoint starts with /
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In production, don't add /api prefix since it's handled by the server
  if (process.env.NODE_ENV === 'production') {
    return `${SERVER_URL}${formattedEndpoint}`;
  }
  
  return `${SERVER_URL}/api${formattedEndpoint}`;
};

// Add axios default config
import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;

// Add retry logic
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