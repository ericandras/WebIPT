import React from "react";
import "./Dropdown.css"; 

const Dropdown = ({ options, value, onChange }) => {
  return (
    <select className="dropdown" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;