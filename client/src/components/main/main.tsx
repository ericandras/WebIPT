//@ts-nocheck
import './main.css'

import Nat from "../nat/Nat";
import Raw from "../raw/raw";
import Mangle from "../mangle/Mangle";
import Filter from "../filter/Filter";



function Main({ activeComponent }) {
 
 
  const renderComponent = () => {
    switch (activeComponent) {
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
    <div className='main-info'>
      {renderComponent()}
      
    </div>
  )
}

export default Main
