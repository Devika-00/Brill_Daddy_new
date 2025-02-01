import { io } from 'socket.io-client';
import { SOCKET_URL } from '../Constants';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try reconnecting
        socket.connect();
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 