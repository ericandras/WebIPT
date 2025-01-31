//@ts-nocheck

import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import sendMessage from "./messages";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const serverUrl = `http://${import.meta.env.VITE_IP_SERVER}:4000`;
    console.log(`Conectando ao servidor: ${serverUrl}`);
    
    const socketInstance = io.connect(serverUrl);
    setSocket(socketInstance);
  }, []);

  const emitMessage = (message) => {
    if (!socket) {
      console.error("Socket não está conectado.");
      return;
    }
    sendMessage(socket, message); 
  };
  return (
    <SocketContext.Provider value={{socket,emitMessage}}>
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => {
  return useContext(SocketContext);
};