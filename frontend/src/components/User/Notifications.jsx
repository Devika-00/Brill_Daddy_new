import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import toast from "../../utils/toaster";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (data) => {
      console.log("Notification received:", data);
      toast.success(data.message, { position: "top-right" });
    });

    return () => socket.off("notification");
  }, [socket]);

  // useEffect(() => {
  //   socket.on("test", (data) => {
  //     console.log("Test event received:", data);
  //     toast.success(data.message);
  //   });
  // }, []);
  

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
