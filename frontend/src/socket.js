import { io } from "socket.io-client";

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.brilldaddy.com'  // Remove /api from the end
  : 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  path: '/socket.io' // Add explicit path
});

// Handle connection events
socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  // Implement exponential backoff
  const timeout = Math.min(1000 * Math.pow(2, socket.reconnectionAttempts), 10000);
  setTimeout(() => {
    socket.connect();
  }, timeout);
});

// Add specific event listeners
socket.on("notification", (data) => {
  console.log("Notification received:", data);
});

// socket.on("test", (data) => {
//   console.log("Test notification received:", data);
// });
