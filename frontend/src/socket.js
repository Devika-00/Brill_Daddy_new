import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // To handle CORS if necessary
});

// Handle connection events (optional)
socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});


socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  // Attempt to reconnect on error
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

// Add specific event listeners
socket.on("notification", (data) => {
  console.log("Notification received:", data);
});

// socket.on("test", (data) => {
//   console.log("Test notification received:", data);
// });
