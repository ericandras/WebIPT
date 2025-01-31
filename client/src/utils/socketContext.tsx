import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import sendMessage from "./messages";

// 🔹 Definição do tipo do contexto (socket nunca é null agora)
interface SocketContextType {
  socket: Socket;
  emitMessage: (message: string) => void;
}

// 🔹 Criando o contexto sem permitir valores indefinidos ou null
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// 🔹 Props para o SocketProvider
interface SocketProviderProps {
  children: React.ReactNode;
}

// 🔹 Componente Provider
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>(
    io(`http://${import.meta.env.VITE_IP_SERVER}:4000`) // 🔹 Inicializa com um socket válido
  );

  useEffect(() => {
    console.log(`Conectando ao servidor: ${import.meta.env.VITE_IP_SERVER}:4000`);

    const socketInstance: Socket = io(`http://${import.meta.env.VITE_IP_SERVER}:4000`);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect(); // 🔹 Garante que o socket seja desconectado ao desmontar o componente
    };
  }, []);

  const emitMessage = (message: string) => {
    sendMessage(socket, message); // Agora `socket` nunca é null
  };

  return (
    <SocketContext.Provider value={{ socket, emitMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

// 🔹 Hook personalizado para acessar o contexto do socket
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket deve ser usado dentro de um <SocketProvider>");
  }
  return context;
};
