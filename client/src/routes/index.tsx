import Filter from "../pages/Filter";
import Mangle from "../pages/Mangle";
import Nat from "../pages/Nat";
import Raw from "../pages/Raw";
import { useRoute } from "./RoutesProvider";


function Routes() {
  
  const {route} = useRoute()
 
  const renderComponent = () => {
    switch (route) {
      case 'Nat':
        return <Nat />;
      case 'Raw':
        return <Raw/>;
      case 'Mangle':
        return <Mangle/>;
      case 'Filter':
        return <Filter/>;
      default:
        return <p>escolha uma opção</p>;
    }
  };



  return (
    <>{renderComponent()}</>
  )
}

export default Routes
