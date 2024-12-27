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
const { initSocket } = require("./socket/socketInstance");
const path = require("path");
const helmet = require('helmet');

const http = require("http");

require("./jobs/winnerSelction");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:4173'
    : 'https://brilldaddy.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));



// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.use("/api/admin",adminRoute);
app.use("/api/user",userRoute);
app.use("/api/voucher",voucherRoute);
app.use("/api/bid",bidRoute);

app.use(helmet());


const port = ENV.PORT || 5002;

server.listen(port, () => {
  connectDb();
  console.log(`Server is running at port ${port}`);
});