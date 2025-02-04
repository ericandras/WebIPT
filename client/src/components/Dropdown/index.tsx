import './style.css'
import { useEffect, useRef, useState } from 'react';

interface Props {
  options: string[],
  onSelect: (e:any) => void,
  placeholder: string
  value: string
}

function Dropdown({value, options, onSelect, placeholder = "#" } : Props) {
  
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a visibilidade do dropdown
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Estado para a opção selecionada
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(selectedOption != value) {
      handleSelect(value)
    }
  }, [value])

  // Função para lidar com a seleção de uma opção
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false); // Fecha o dropdown após a seleção
    onSelect(value);

  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Adiciona o event listener quando o dropdown está aberto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Remove o event listener quando o componente é desmontado ou o dropdown é fechado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`dropdown-wrapper ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
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