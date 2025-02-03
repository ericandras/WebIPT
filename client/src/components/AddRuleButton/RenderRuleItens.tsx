import DropdownInput from "../DropdownInput";
import { FormItem } from "../../interfaces/chain";
import Checkbox from "../Checkbox";
import Dropdown from "../Dropdown";
import Input from "../Input";

interface Props {
  formItens: FormItem[]
  handle: (index: number,command:string, val: string) => void;
  newRule: {command: string, value: string}[]
}

export default function({formItens, handle, newRule} : Props) {
  return <form> 
    {formItens.map((item, index) => {
      switch (item.type) {
        case 'select':
          return <Dropdown
            key={index}
            options={item.options??[]} 
            onSelect={(val) => handle(index, item.command, val)} 
            value={newRule[index]&&newRule[index].value ? newRule[index].value : ''}
            placeholder={item.title}
          />
        case 'select/text':
          return <DropdownInput 
            key={index}    
            options={item.options??[]} 
            value={newRule[index]&&newRule[index].value ? newRule[index].value : ''} 
            onSelect={(val) => handle(index,item.command, val)} 
            placeholder={item.title}
            />
        case 'text':
          return <Input key={index} value={newRule[index]&&newRule[index].value ? newRule[index].value : ''} onChange={(val) => handle(index, item.command, val)} placeholder={item.title} />
        case 'checkbox': 
          return <Checkbox key={index} value={newRule[index]&&newRule[index].value ? newRule[index].value : ''} title={item.title} onSelect={(val) => handle(index, item.command, val ? item.command : '')} />
      }
    })}
  </form>
}