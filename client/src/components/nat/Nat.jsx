import {useState, useEffect} from 'react'
import sendMessage from '../../utils/messages';
import { useSocket } from '../../utils/socketContext';


// console.log('variable', import.meta.env.VITE_IP)
function Nat() {

  const socket = useSocket()
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
        <button onClick={() => {sendMessage(socket,message)}}>Send message</button>
        <h1>
          Message: {messageReceived.map((e , index )=> <div key={index}>{e}</div>)}</h1>
    </div>
  )
}

export default Nat
