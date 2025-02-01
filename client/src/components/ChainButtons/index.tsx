import React from 'react';
import { ChainKey } from '../../interfaces/chain';
import './style.css'

interface Props {
    chains: ChainKey[];
    onSelect:React.Dispatch<React.SetStateAction<ChainKey>>
    selected: string
}

const ChainButtons = ({chains, onSelect, selected}: Props) => {
    
    return (
        <menu className='chains-button'>
        {chains.map((btn) => (
         <button 
            key={btn} 
            className={selected === btn ? "active" : ''} 
            onClick={() => {onSelect(btn)}}>
                {btn}
        </button>
        ))}
      </menu>
       
    );
}

export default ChainButtons;
