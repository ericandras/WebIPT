import { Socket } from "socket.io-client";

export default function sendMessage(socket:Socket, message:string) {
  if (!socket) {
    console.error("Socket não está conectado.");
    return;
  }
  
  try {
    socket.emit("input_command", { command: message });
    console.log('concluido',message)
  } catch (error) {
    console.log('socket emit bixado',error)
  }
}