import {useState, useEffect} from 'react'
import sendMessage from '../../utils/messages';
import io from "socket.io-client";
const socket = io.connect(`http://${import.meta.env.VITE_IP_SERVER}:4000`); 

// console.log('variable', import.meta.env.VITE_IP)
function Nat() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  
  useEffect(() => {
    socket.on("output_command", (data) => {
      console.log('osheoshe')
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
        <button onClick={() => {sendMessage(message)}}>Send message</button>
        <h1>
          Message: {messageReceived.map(e => <div>{e}</div>)}</h1>
    </div>
  )
}

export default Nat
