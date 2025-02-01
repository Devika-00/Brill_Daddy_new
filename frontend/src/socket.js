import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  timeout: 10000,
  autoConnect: true,
  secure: true,
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.log('Socket connection error:', {
    message: error.message,
    description: error.description,
    type: error.type
  });
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
