const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:5173', 'http://localhost:4173']
    : ['https://brilldaddy.com', 'https://www.brilldaddy.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Update helmet configuration to be less restrictive in development
const helmetConfig = {
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "*"],
      connectSrc: ["'self'", "*"],
      imgSrc: ["'self'", "data:", "https:", "http:", "*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*"],
      styleSrc: ["'self'", "'unsafe-inline'", "*"],
      fontSrc: ["'self'", "data:", "https:", "http:", "*"],
      mediaSrc: ["'self'", "data:", "https:", "http:", "*"],
      frameSrc: ["'self'", "*"]
    }
  }
};

app.use(helmet(helmetConfig));

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