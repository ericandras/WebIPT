import "./styles/global.css";
import Routes from './routes'
import Menu from "./components/Menu";
import { TableProvider } from "./contexts/TableContext";


function App() {

  return (
    <div className='bg'>
      <Menu />
      <TableProvider>
        <Routes />
      </TableProvider>
    </div>
  );
}

export default App;