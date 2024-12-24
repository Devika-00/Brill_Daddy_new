import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../Redux/Store/store";
// import toast from "../utils/toaster";
import { toast } from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const user = useAppSelector((state) => state.user);
  const userId = user?.id;
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      if (userId) {
        console.log("Joining room with userId:", userId);
        socket.emit("joinRoom", userId);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNotificationEvent(data) {
      console.log("Notification received in context:", data);
      toast.success(data.message, {
        duration: 5000,
        position: "top-right",
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    }

    // function onTestEvent(data) {
    //   console.log("Test notification received in context:", data);
    //   toast.success(data.message, {
    //     duration: 5000,
    //     position: "top-right",
    //     style: {
    //       background: '#333',
    //       color: '#fff',
    //     },
    //   });
    // }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification', onNotificationEvent);
    // socket.on('test', onTestEvent);

    if (socket.connected && userId) {
      socket.emit("joinRoom", userId);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification', onNotificationEvent);
    //   socket.off('test', onTestEvent);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);