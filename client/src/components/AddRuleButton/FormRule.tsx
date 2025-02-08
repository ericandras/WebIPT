import { useEffect, useState } from "react";
import { ChainKey, ChainOptions, FormItem, OptionField } from "../../interfaces/chain";
import Dropdown from "../Dropdown"
import { useSocket } from "../../contexts/SocketContext/socketContext";
import RenderRuleItens from "./RenderRuleItens";
import { Command } from "../../utils/getOptionsChain";


interface Props {
  selectedChain: ChainKey;
  chainOptions: ChainOptions;
  table: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function({selectedChain, chainOptions, table, setIsModalOpen} : Props) {

  const {socket, emitMessage} = useSocket();

  const [newRule, setNewRule] = useState<{command: string, value: string}[]>([]);
  const [textRule, setTextRule] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [formItens, setFormItens] = useState<FormItem[]>([]);

  useEffect(() => {
    const form:FormItem[] = []
    const targets:FormItem = {
      required: true,
      command: '-j',
      type: 'select',
      title: 'target',
      info: 'Ação a ser realizada',
      options: Object.keys(chainOptions[selectedChain]!).map((key) => ({value: key}))
    }
    form.push(targets)
    const extraOptions:{conditional: any; option: OptionField[]}[] = []
    if(newRule[0]&&newRule[0].value&&newRule[0].value!='') {
      for(let i =0; i < chainOptions[selectedChain]![newRule[0].value].required!.length; i++) {
        const formItem = chainOptions[selectedChain]![newRule[0].value].required![i]
        if(formItem.optional) {
          extraOptions.push({conditional: form.length, option: formItem.optional!})
        }
        form.push({ ...formItem, options:formItem.options ? formItem.options.filter(e=> e.requirement==undefined || e.requirement(textRule)): undefined , required: true })
      }

      if(chainOptions[selectedChain]![newRule[0].value].optional) {
        for(let i =0; i < chainOptions[selectedChain]![newRule[0].value].optional!.length; i++) {
          const formItem = chainOptions[selectedChain]![newRule[0].value].optional![i]
          if(formItem.optional) {
            extraOptions.push({conditional: form.length, option: formItem.optional!})
          }
          form.push({ ...formItem, options:formItem.options ? formItem.options.filter(e=> e.requirement==undefined || e.requirement(textRule)): undefined , required: false })
        }
      }
    }
    
    for (let i=0; i< extraOptions.length; i++) {
      if(newRule[extraOptions[i].conditional]&&newRule[extraOptions[i].conditional].value!= ''){
       for (let h=0; h<extraOptions[i].option.length; h++) {
        const formItem = extraOptions[i].option[h]
        if(formItem.requirement == undefined || formItem.requirement(textRule)) {
          form.push({...formItem, required: false})
        }
       } 
      }
    }

    
    setFormItens(form)
    // setSelectedAction()

  }, [newRule, selectedChain, textRule]) 


  const makeCommand = (form: {command: string, value: string}[]) => {
    let command_start = `iptables -t nat -A ${selectedChain.toUpperCase()} `
    let command_end = ''
    for(let i=0; i< form.length; i++) {
      if(form[i]&&form[i].value!='') {
        if((['-j', '--to-source', '--random', '--persistent', '--to-destination']).includes(form[i].command)) {
          command_end += form[i].command == form[i].value ? `${form[i].command} ` : `${form[i].command} ${form[i].value} `
        } else {
          command_start += form[i].command == form[i].value ? `${form[i].command} ` : `${form[i].command} ${form[i].value} `
        }
      }
    }
    return command_start + command_end
  }

const handleSave = () => {
  setIsModalOpen(false);
  emitMessage(makeCommand(newRule));
  setTimeout(() => {
    emitMessage(table);
  }, 100)
};


const handleDropdownChange = (index:number, command: string, value:string) => {
 

  let updatedRule = [...newRule];
  updatedRule[index] = { command, value};
  if(newRule[index]&&newRule[index].command === '-j' && newRule[index].value != value) {
    updatedRule = [{ command, value}]
  }
  setNewRule(updatedRule);

  setTextRule(makeCommand(updatedRule))
  console.log( makeCommand(updatedRule))
};

 return <>
  <h2 className="title-add-rule">Adicionar Nova Regra <span>{selectedChain}</span></h2>
  <RenderRuleItens handle={handleDropdownChange} formItens={formItens} newRule={newRule} />
  <button className="formButton save-button" onClick={handleSave}>Salvar</button>
 </>
}

