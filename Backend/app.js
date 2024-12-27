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

// Try to require helmet, use a fallback if not available
let helmet;
try {
  helmet = require('helmet');
} catch (e) {
  console.warn('Helmet package not found, skipping security headers');
  helmet = () => (req, res, next) => next();
}

require("./jobs/winnerSelction");

const app = express();
const server = http.createServer(app);


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
  app.use('/', adminRoute);
  app.use('/', userRoute);
  app.use('/', voucherRoute);
  app.use('/', bidRoute);
} else {
  app.use('/api/admin', adminRoute);
  app.use('/api/user', userRoute);
  app.use('/api/voucher', voucherRoute);
  app.use('/api/bid', bidRoute);
}

// Use helmet middleware with fallback
app.use(helmet);

// Global error handler should be last
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