import './style.css'
import { useState } from 'react';

interface Props {
  options: string[],
  value: string,
  onSelect: (e:any) => void,
  placeholder: string
}

function Dropdown({ options, value, onSelect, placeholder = "#" } : Props) {
  
 const [isOpen, setIsOpen] = useState(false); // Estado para controlar a visibilidade do dropdown
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Estado para a opção selecionada

  // Função para lidar com a seleção de uma opção
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false); // Fecha o dropdown após a seleção
    onSelect(value);

  };

  return (
    <div className='dropdown-wrapper'>
      {/* Botão que abre/fecha o dropdown */}
      <div className={`dropdown ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || placeholder}
      </div>

      {/* Lista de opções (dropdown) */}
      {isOpen && (
        <div
        className='option-wrapper'
        >
          {options.filter(e => e !== selectedOption).map((option) => (
            <div
              key={option}
              className='option'
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;