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

// Update CORS configuration
const corsOptions = {
  origin: ['https://brilldaddy.com', 'https://www.brilldaddy.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'X-Requested-With',
    'Accept',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'User-Agent',
    'DNT',
    'Cache-Control',
    'Keep-Alive',
    'If-Modified-Since'
  ],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 1728000, // 20 days
  preflightContinue: false
};

app.use(cors(corsOptions));

// Configure Helmet with updated CSP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://brilldaddy.com", "https://api.brilldaddy.com"],
      connectSrc: ["'self'", "https://brilldaddy.com", "wss://api.brilldaddy.com", "https://api.brilldaddy.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:", "https:", "http:"],
      mediaSrc: ["'self'", "data:", "https:", "http:"],
      frameSrc: ["'self'", "https://brilldaddy.com"]
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

// Add this before any routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// Root route should come before API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
const apiRouter = express.Router();

// Mount routes on apiRouter
apiRouter.use('/admin', adminRoute);
apiRouter.use('/user', userRoute);
apiRouter.use('/voucher', voucherRoute);
apiRouter.use('/bid', bidRoute);

// Mount apiRouter under /api
app.use('/api', apiRouter);

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// 404 handler should come after all routes
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: `The requested URL ${req.originalUrl} was not found`,
    method: req.method,
    path: req.path
  });
});

// Socket.IO configuration
const io = new Server(server, {
  cors: corsOptions,
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

// Error handler remains at the end
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