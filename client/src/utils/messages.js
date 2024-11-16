

function sendMessage(message) {
    socket.emit("input_command", { command: message });
}

export default sendMessage