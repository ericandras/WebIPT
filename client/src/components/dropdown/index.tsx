
interface Props {
  options: string[],
  value: string,
  onChange: (e:any) => void,
  placeholder: string
}

function Dropdown({ options, value, onChange, placeholder = "Selecione uma opção" } : Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="dropdown"
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default Dropdown;