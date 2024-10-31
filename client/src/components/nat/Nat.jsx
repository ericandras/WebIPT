import {useState, useEffect} from 'react'
import io from "socket.io-client";
console.log(`http://${import.meta.env.VITE_IP}:4000`)
const socket = io.connect(`http://${import.meta.env.VITE_IP}:4000`); 
// console.log('variable', import.meta.env.VITE_IP)
function Nat() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  function sendMessage() {
    console.log("Button clicked");
    socket.emit("input_command", { command: message });
  }
  useEffect(() => {
    socket.on("output_command", (data) => {
      setMessageReceived(data.lines);
    });
  }, [socket]);
  return (
   
    <div>
      <input
          placeholder="Message"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>Send message</button>
        <h1>
          Message: {messageReceived.map(e => <div>{e}</div>)}</h1>
    </div>
  )
}

export default Nat
