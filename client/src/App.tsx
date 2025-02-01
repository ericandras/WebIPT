import "./styles/global.css";
import Routes from './routes'
import Menu from "./components/Menu";


function App() {

  return (
    <div className='bg'>
      <Menu />
      <Routes />
    </div>
  );
}

export default App;