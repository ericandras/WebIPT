import { FormItem } from "../../interfaces/chain";
import Dropdown from "../Dropdown";

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
            value={newRule[index]} 
            onChange={(val) => handle(index, val)} 
            placeholder="Escolha uma regra"
          />
      }
    })}
  </form>
}