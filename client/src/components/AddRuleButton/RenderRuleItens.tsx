import DropdownInput from "../DropdownInput";
import { FormItem } from "../../interfaces/chain";
import Checkbox from "../Checkbox";
import Dropdown from "../Dropdown";
import Input from "../Input";
import CloudInfo from "./CloudInfo";

interface Props {
  formItens: FormItem[]
  handle: (index: number,command:string, val: string) => void;
  newRule: {command: string, value: string}[]
}

export default function({formItens, handle, newRule} : Props) {
  return <div className="render-rule-itens-container">
    <form className="render-rule-itens"> 
    {formItens.map((item, index) => {
      const existingRule = newRule.find(rule => rule&&rule.command === item.command);
      switch (item.type) {
        case 'select':
            return <div className="rule-item-form"><Dropdown
            key={index}
            options={item.options??[]} 
            onSelect={(val) => handle(index, item.command, val)} 
            value={existingRule ? existingRule.value : ''}
            placeholder={item.title}
            /> <CloudInfo info={item.info} key={index}/> </div>
        case 'select/text':
          return <div className="rule-item-form"><DropdownInput 
            key={index}    
            options={item.options??[]} 
            value={existingRule ? existingRule.value : ''} 
            onSelect={(val) => handle(index,item.command, val)} 
            placeholder={item.title}
            /><CloudInfo info={item.info} key={index}/></div>
        case 'text':
          return <div className="rule-item-form"><Input key={index} value={existingRule ? existingRule.value : ''} onChange={(val) => handle(index, item.command, val)} placeholder={item.title} /><CloudInfo info={item.info} key={index}/></div>
        case 'checkbox': 
          return <div className="rule-item-form"><Checkbox key={index} value={existingRule ? existingRule.value : ''} title={item.title} onSelect={(val) => handle(index, item.command, val ? item.command : '')} /><CloudInfo info={item.info} key={index}/></div>
      }
    })}
  </form>
  </div>
}