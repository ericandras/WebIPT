import { options } from '../../interfaces/chain';
import Input from '../Input';
import './style.css'
import { useEffect, useRef, useState } from 'react';

interface Props {
  options: options[],
  value: string,
  onSelect: (e:any) => void,
  placeholder: string
}

function DropdownInput({ options, onSelect, placeholder = "#", value} : Props) {
  
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a visibilidade do dropdown
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Estado para a opção selecionada
  const [isInput, setIsInput] = useState<boolean>(true)
  const [inputValue, setInputValue] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função para lidar com a seleção de uma opção
  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false); // Fecha o dropdown após a seleção
    onSelect(value);
  };

  const handleInput = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false); // Fecha o dropdown após a seleção
    setInputValue(value)
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

  useEffect(() => {
    if(selectedOption != value) {
      setIsInput(true)
      handleInput(value)
    }
  }, [value])


  return (
    <div className={`dropdown-wrapper ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      {/* Botão que abre/fecha o dropdown */}
      <div className={`dropdown ${isOpen ? 'open' : ''} ${isInput ? 'select-input': ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        { isInput ? 
        <Input ref={inputRef} placeholder={placeholder} value={inputValue} onChange={handleInput} /> 
        :  selectedOption || placeholder}
      </div>

      {/* Lista de opções (dropdown) */}
      {isOpen && (
        <div
        className='option-wrapper'
        >
          {options.filter(e => e.value !== selectedOption).map((option) => (
            <div
              key={option.value}
              className='option'
              onClick={() => {
                setIsInput(false)
                handleSelect(option.value)
              }}
            >
              {option.value}
            </div>
          ))}

     {isInput ? '' : 
        <div
          className='option'
          onClick={() => {
            setIsInput(true)
            handleSelect(inputValue)
            setTimeout(() => {
              inputRef.current?.focus()
            },0)
            
          }} >
          {inputValue!=''?inputValue: 'write...'}
        </div>
      }   
        </div>
      )}
    </div>
  );
}

export default DropdownInput;