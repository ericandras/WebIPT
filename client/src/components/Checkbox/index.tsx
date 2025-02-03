import React, { useState } from 'react';
import './style.css'; // Importando o arquivo CSS

interface CheckboxProps {
  title: string; // Título do checkbox
  onSelect: (isChecked: boolean) => void; // Função chamada quando o estado muda
}

const Checkbox: React.FC<CheckboxProps> = ({ title, onSelect }) => {
  const [isOn, setIsOn] = useState(false);

  // Função para lidar com a mudança de estado
  const handleCheckboxChange = () => {
    const newCheckedState = !isOn;
    setIsOn(newCheckedState);
    onSelect(newCheckedState); // Chama a função onSelect com o novo estado
  };



  return (
    <div className="toggle-container">
      <span className="ip-text">{title}</span>
      <div className={`switch ${isOn ? "on" : "off"}`} onClick={() => handleCheckboxChange()}>
        <div className="slider" />
      </div>
    </div>
  );
};

export default Checkbox