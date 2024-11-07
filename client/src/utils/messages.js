
import io from "socket.io-client";
console.log(`http://${import.meta.env.VITE_IP_SERVER}:4000`)
const socket = io.connect(`http://${import.meta.env.VITE_IP_SERVER}:4000`); 

function sendMessage(message) {
    socket.emit("input_command", { command: message });
}

export default sendMessage