import React, { useState } from 'react';
import './style.css';
import { useRoute } from '../../routes/RoutesProvider';

function Menu() {
  
  const {route, setRoute} = useRoute()

  return (
    <nav>
      <ul className='links-container'>
        <li className={`link ${route === 'Nat' ? 'active' : ''}`} onClick={() => setRoute('Nat')}><span>Nat</span></li>
        <li className={`link ${route === 'Raw' ? 'active' : ''}`} onClick={() => setRoute('Raw')}><span>Raw</span></li>
        <li className={`link ${route === 'Mangle' ? 'active' : ''}`} onClick={() => setRoute('Mangle')}><span>Mangle</span></li>
        <li className={`link last  ${route === 'Filter' ? 'active' : ''}`} onClick={() => setRoute('Filter')}><span>Filter</span></li>
      </ul>
    </nav>
  );
}

export default Menu;