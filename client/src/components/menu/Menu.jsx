import React from 'react'
import './Menu.css'

function Menu() {
  return (
    <nav>
      <ul className='links-container'>
        <li className='link'>Nat</li>
        <li className='link'>Raw</li>
        <li className='link'>Mangle</li>
        <li className='link last'>Filter</li>
      </ul>
    </nav>
  )
}

export default Menu
