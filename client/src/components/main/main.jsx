import { useEffect, useState } from "react";
import './main.css'
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");

function Main() {
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
    <div className='main-info'>
      <div className="App">
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
    </div>
  )
}

export default Main
