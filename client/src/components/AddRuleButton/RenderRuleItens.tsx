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
  return <form className="render-rule-itens"> 
    {formItens.map((item, index) => {
      const existingRule = newRule.find(rule => rule&&rule.command === item.command);
      switch (item.type) {
        case 'select':
            return <Dropdown
            key={index}
            options={item.options??[]} 
            onSelect={(val) => handle(index, item.command, val)} 
            value={existingRule ? existingRule.value : ''}
            placeholder={item.title}
            />
        case 'select/text':
          return <DropdownInput 
            key={index}    
            options={item.options??[]} 
            value={existingRule ? existingRule.value : ''} 
            onSelect={(val) => handle(index,item.command, val)} 
            placeholder={item.title}
            />
        case 'text':
          return <Input key={index} value={existingRule ? existingRule.value : ''} onChange={(val) => handle(index, item.command, val)} placeholder={item.title} />
        case 'checkbox': 
          return <Checkbox key={index} value={existingRule ? existingRule.value : ''} title={item.title} onSelect={(val) => handle(index, item.command, val ? item.command : '')} />
      }
    })}
  </form>
}