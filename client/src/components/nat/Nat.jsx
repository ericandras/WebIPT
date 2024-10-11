import {useState, useEffect} from 'react'
import io from "socket.io-client";
import 'dotenv/config'
const socket = io.connect(`http://${process.env.IP}:4000`); 

function Nat() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  function sendMessage() {
    console.log("Button clicked");
    socket.emit("send_message", { message: message });
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data);
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
