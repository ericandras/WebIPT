import "./App.css";
import { useEffect, useState } from "react";
import Main from './components/main'
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");

function App() {
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
    <>
      <h1>Teste darkmode</h1>

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
<div className='bg'>
    
      <Main> </Main>
    </div>
</>
    
   
  );
}

export default App;