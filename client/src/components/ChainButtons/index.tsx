import React from 'react';
import { ChainKey } from '../../interfaces/chain';

interface Props {
    chains: ChainKey[];
    onSelect:React.Dispatch<React.SetStateAction<ChainKey>>
    selected: string
}

const ChainButtons = ({chains, onSelect, selected}: Props) => {
    
    return (
        <menu>
        {chains.map((btn) => (
         <button 
            key={btn} 
            className={selected === btn ? "active" : ''} 
            onClick={() => {onSelect(btn)}}>{btn}
            </button>
        ))}
      </menu>
       
    );
}

export default ChainButtons;
