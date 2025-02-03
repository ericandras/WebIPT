import { useEffect, useState } from "react";
import { ChainKey, ChainOptions, FormItem, OptionField } from "../../interfaces/chain";
import Dropdown from "../Dropdown"
import { useSocket } from "../../contexts/SocketContext/socketContext";
import RenderRuleItens from "./RenderRuleItens";


interface Props {
  selectedChain: ChainKey;
  chainOptions: ChainOptions;
  table: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function({selectedChain, chainOptions, table, setIsModalOpen} : Props) {

  const {socket, emitMessage} = useSocket();

  const [newRule, setNewRule] = useState<{command: string, value: string}[]>([]);
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
      options: Object.keys(chainOptions[selectedChain]!)
    }
    form.push(targets)
    const extraOptions:{conditional: any; option: OptionField[]}[] = []
    if(newRule[0]&&newRule[0].value&&newRule[0].value!='') {
      for(let i =0; i < chainOptions[selectedChain]![newRule[0].value].required!.length; i++) {
        if(chainOptions[selectedChain]![newRule[0].value].required![i].optional) {
          extraOptions.push({conditional: form.length, option: chainOptions[selectedChain]![newRule[0].value].required![i].optional!})
        }
        form.push({ ...chainOptions[selectedChain]![newRule[0].value].required![i], required: true })
      }
      if(chainOptions[selectedChain]![newRule[0].value].optional) {
        for(let i =0; i < chainOptions[selectedChain]![newRule[0].value].optional!.length; i++) {
          form.push({ ...chainOptions[selectedChain]![newRule[0].value].optional![i], required: false })
        }
      }
    }
    
    for (let i=0; i< extraOptions.length; i++) {
      if(newRule[extraOptions[i].conditional]&&newRule[extraOptions[i].conditional].value!= ''){
       for (let h=0; h<extraOptions[i].option.length; h++) {
        form.push({...extraOptions[i].option[i], required: false})
       } 
      }
    }

    
    setFormItens(form)
    // setSelectedAction()

  }, [newRule, selectedChain]) 

const handleSave = () => {
  // const teste = `iptables -t nat -A ${selectedChain.toUpperCase()} -j ${newRule[0]}${newRule[1] == "TCP/UDP" ? "" : ` -p ${newRule[1]}`}${newRule[2]} `
  setIsModalOpen(false);
  // console.log("Nova regra adicionada:", teste);
  // emitMessage(teste)
  emitMessage(table);
};


const handleDropdownChange = (index:number, command: string, value:string) => {
 

  let updatedRule = [...newRule];
  updatedRule[index] = { command, value};
  if(newRule[index]&&newRule[index].command === '-j' && newRule[index].value != value) {
    updatedRule = [{ command, value}]
  }
  setNewRule(updatedRule);

  let commandT = `iptables -t nat -A ${selectedChain.toUpperCase()} `
  for(let i=0; i< updatedRule.length; i++) {
    if(updatedRule[i]&&updatedRule[i].value!='') {
      commandT += updatedRule[i].command == updatedRule[i].value ? `${updatedRule[i].command} ` : `${updatedRule[i].command} ${updatedRule[i].value} `
    }
  }

  console.log(commandT)
};

 return <>
  <h2 className="title-add-rule">Adicionar Nova Regra <span>{selectedChain}</span></h2>
  <RenderRuleItens handle={handleDropdownChange} formItens={formItens} newRule={newRule} />
  <button className="formButton save-button" onClick={handleSave}>Salvar</button>
 </>
}

