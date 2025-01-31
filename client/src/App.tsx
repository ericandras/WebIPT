import "./App.css";
import { useState } from "react";
import Main from './components/main/main'
import Menu from "./components/menu/Menu";


function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <div className='bg'>
      <Menu onMenuClick={setActiveComponent} activeComponent={activeComponent}/>
      <Main activeComponent={activeComponent} />
    </div>

    
   
  );
}

export default App;