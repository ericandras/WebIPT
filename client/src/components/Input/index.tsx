import { ChangeEvent, forwardRef, useEffect, useState } from "react"
import "./style.css"

interface Props {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
}
const Input = forwardRef<HTMLInputElement, Props>(
  ({ value = '', onChange, placeholder = '...' }, ref) => {
  const [val, setValue] = useState<string>(value)
  console.log('value', val)
  useEffect(() => {
    if(val != value) {
      console.log('value', value)
      setValue(value)
    }
  }, [value])

  const valid = () => {
    return true
  }

  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setValue(text);

    if (valid()) {
      onChange(text)
    }
  }

  return <input ref={ref} className="input" onChange={handleChange} value={val} placeholder={placeholder}/>
})

export default Input