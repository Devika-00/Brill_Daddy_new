export const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.brilldaddy.com/api'
  : 'http://localhost:80'; // Or whatever port your local backend runs on 