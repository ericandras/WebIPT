function sendMessage(socket, message) {
    if (!socket) {
      console.error("Socket não está conectado.");
      return;
    }
    socket.emit("input_command", { command: message });
  }
  
  export default sendMessage;