import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  path: '/socket.io',
  // Add namespace
  namespace: '/chat'
});

let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
  reconnectAttempts = 0;
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
  
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
    console.log(`Attempting to reconnect in ${timeout/1000} seconds...`);
    
    setTimeout(() => {
      socket.connect();
    }, timeout);
  } else {
    console.error("Max reconnection attempts reached");
  }
});

// Add specific event listeners
socket.on("notification", (data) => {
  console.log("Notification received:", data);
});

// socket.on("test", (data) => {
//   console.log("Test notification received:", data);
// });
