import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';

export const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
  path: '/socket.io',
  timeout: 10000,
  autoConnect: false,
  secure: true,
  rejectUnauthorized: false
});

socket.on('connect_error', (error) => {
  console.log('Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
