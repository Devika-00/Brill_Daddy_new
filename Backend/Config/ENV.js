const dotenv = require("dotenv");

dotenv.config();

const ENV = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  BASE_URL: process.env.BASE_URL || '/api',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = ENV; 
