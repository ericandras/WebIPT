//@ts-nocheck

import React, { useState } from 'react';
import './Menu.css';

function Menu({ onMenuClick , activeComponent}) {
  

  return (
    <nav>
      <ul className='links-container'>
        <li className={`link ${activeComponent === 'Nat' ? 'active' : ''}`} onClick={() => onMenuClick('Nat')}>Nat</li>
        <li className={`link ${activeComponent === 'Raw' ? 'active' : ''}`} onClick={() => onMenuClick('Raw')}>Raw</li>
        <li className={`link ${activeComponent === 'Mangle' ? 'active' : ''}`} onClick={() => onMenuClick('Mangle')}>Mangle</li>
        <li className={`link last  ${activeComponent === 'Filter' ? 'active' : ''}`} onClick={() => onMenuClick('Filter')}>Filter</li>
      </ul>
    </nav>
  );
}

export default Menu;