const { Server } = require("socket.io");

let io;

// Create a config object to reuse across your application
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:4173' 
        : 'https://brilldaddy.com',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    // Add path prefix to avoid namespace errors
    path: '/socket.io/',
    // Add error handling
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": process.env.NODE_ENV === 'development' 
          ? 'http://localhost:4173' 
          : 'https://brilldaddy.com',
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true
      });
      res.end();
    }
  });



  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`User ${userId} joined room`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error("Socket.IO instance is not initialized. Call initSocket first.");
  }
  return io;
};

module.exports = {
  initSocket,
  getSocketInstance,
};