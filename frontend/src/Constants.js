export const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.brilldaddy.com'
  : 'http://localhost:5000'; 

// Add a helper function to construct API URLs
export const getApiUrl = (endpoint) => {
  return `${SERVER_URL}/api${endpoint}`;
}; 