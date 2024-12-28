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

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://brilldaddy.com',
    'https://www.brilldaddy.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
apiRouter.use('/admin', adminRoute);
apiRouter.use('/user', userRoute);
apiRouter.use('/voucher', voucherRoute);
apiRouter.use('/bid', bidRoute);

// Mount apiRouter under /api
app.use('/api', apiRouter);

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://brilldaddy.com',
      'https://www.brilldaddy.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
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

// 404 handler - move this after all routes
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `The requested URL ${req.originalUrl} was not found`,
    method: req.method,
    path: req.path
  });
});

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