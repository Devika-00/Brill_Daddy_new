const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const ENV = require("./Config/ENV");
const connectDb = require("./Config/Connection");
const adminRoute = require("./Routes/adminRoutes");
const userRoute = require("./Routes/userRoutes");
const voucherRoute = require("./Routes/voucherRoutes");
const bidRoute = require("./Routes/bidRoutes");
const { Server } = require("socket.io");
const path = require("path");
const http = require("http");
const helmet = require('helmet');

require("./jobs/winnerSelction");

const app = express();
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
  'https://brilldaddy.com',
  'https://www.brilldaddy.com',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://api.brilldaddy.com',
  'https://mollusk-creative-cockatoo.ngrok-free.app'
];

// Configure routes with specific headers
const setHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from any origin in development
  if (process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

// Apply headers to all routes
app.use(setHeaders);

// Update helmet configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", ...allowedOrigins, "*"],
      connectSrc: ["'self'", ...allowedOrigins, "*"],
      imgSrc: ["'self'", "data:", "https:", "http:", "*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*"],
      styleSrc: ["'self'", "'unsafe-inline'", "*"],
      fontSrc: ["'self'", "data:", "https:", "http:", "*"],
      mediaSrc: ["'self'", "data:", "https:", "http:", "*"],
      frameSrc: ["'self'", "*"]
    }
  }
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// API Routes
const apiRouter = express.Router();

// Mount routes on apiRouter
apiRouter.use('/user', userRoute);
apiRouter.use('/voucher', voucherRoute);
apiRouter.use('/bid', bidRoute);
apiRouter.use('/admin', adminRoute);

// Mount apiRouter under BASE_URL
const baseUrl = ENV.BASE_URL || '/api';
app.use(baseUrl, apiRouter);

// Add health check endpoint
app.get(`${baseUrl}/health`, (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO configuration
const io = new Server(server, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  maxHttpBufferSize: 1e6
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const port = ENV.PORT || 5002;

server.listen(port, () => {
  connectDb();
  console.log(`Server is running at port ${port}`);
});