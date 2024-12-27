const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
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

// Security middleware
app.use(helmet());

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://brilldaddy.com',
    'https://www.brilldaddy.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Socket.IO configuration
const io = new Server(server, {
  cors: corsOptions,
  path: '/socket.io',
  serveClient: false
});

// Define chat namespace
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
  console.log('Client connected to chat:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from chat:', socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
if (process.env.NODE_ENV === 'production') {
  app.use('/admin', adminRoute);
  app.use('/user', userRoute);
  app.use('/voucher', voucherRoute);
  app.use('/bid', bidRoute);
} else {
  app.use('/api/admin', adminRoute);
  app.use('/api/user', userRoute);
  app.use('/api/voucher', voucherRoute);
  app.use('/api/bid', bidRoute);
}

// Add this before your error handler
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      error: 'Not Found',
      message: `The requested URL ${req.originalUrl} was not found`,
      method: req.method,
      path: req.path,
      originalUrl: req.originalUrl
    });
  });
}

// Your existing error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = ENV.PORT || 5002;

server.listen(port, () => {
  connectDb();
  console.log(`Server is running at port ${port}`);
});