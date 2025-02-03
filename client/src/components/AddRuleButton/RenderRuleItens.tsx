import DropdownInput from "../../DropdownInput";
import { FormItem } from "../../interfaces/chain";
import Checkbox from "../Checkbox";
import Dropdown from "../Dropdown";
import Input from "../Input";

interface Props {
  formItens: FormItem[]
  handle: (index: number, val: string) => void;
  newRule: string[]
}

export default function({formItens, handle, newRule} : Props) {
  return <form> 
    {formItens.map((item, index) => {
      switch (item.type) {
        case 'select':
          return <Dropdown
            key={index}
            options={item.options??[]} 
            onSelect={(val) => handle(index, val)} 
            placeholder={item.title}
          />
        case 'select/text':
          return <DropdownInput 
            key={index}    
            options={item.options??[]} 
            value={newRule[index]} 
            onSelect={(val) => handle(index, val)} 
            placeholder={item.title}
            />
        case 'text':
          return <Input key={index} value={newRule[index]} onChange={(val) => handle(index, val)} placeholder={item.title} />
        case 'checkbox': 
          return <Checkbox key={index} title={item.title} onSelect={(val) => handle(index, val ? item.command : '')} />
      }
    })}
  </form>
}