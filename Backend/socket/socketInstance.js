const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
    pingTimeout: 60000,
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