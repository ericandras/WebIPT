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

  const [newRule, setNewRule] = useState<string[]>([]);
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
    if(newRule[0]&&newRule[0]!='') {
      for(let i =0; i < chainOptions[selectedChain]![newRule[0]].required!.length; i++) {
        if(chainOptions[selectedChain]![newRule[0]].required![i].optional) {
          extraOptions.push({conditional: form.length, option: chainOptions[selectedChain]![newRule[0]].required![i].optional!})
        }
        form.push({ ...chainOptions[selectedChain]![newRule[0]].required![i], required: true })
      }
      if(chainOptions[selectedChain]![newRule[0]].optional) {
        for(let i =0; i < chainOptions[selectedChain]![newRule[0]].optional!.length; i++) {
          form.push({ ...chainOptions[selectedChain]![newRule[0]].optional![i], required: false })
        }
      }
    }
    
    for (let i=0; i< extraOptions.length; i++) {
      if(newRule[extraOptions[i].conditional]&&newRule[extraOptions[i].conditional]!= ''){
       for (let h=0; h<extraOptions[i].option.length; h++) {
        form.push({...extraOptions[i].option[i], required: false})
       } 
      }
    }

    
    setFormItens(form)

    console.log('targets....,',targets)

    // setSelectedAction()

  }, [newRule, selectedChain]) 

const handleSave = () => {
  const teste = `iptables -t nat -A ${selectedChain.toUpperCase()} -j ${newRule[0]}${newRule[1] == "TCP/UDP" ? "" : ` -p ${newRule[1]}`}${newRule[2]} `
  setIsModalOpen(false);
  console.log("Nova regra adicionada:", teste);
  emitMessage(teste)
  emitMessage(table);
};


const handleDropdownChange = (index:number, value:any) => {
  const updatedRule = [...newRule];
  updatedRule[index] = value;
  setNewRule(updatedRule);
};

 return <>
  <h2 className="title-add-rule">Adicionar Nova Regra <span>{selectedChain}</span></h2>
  <RenderRuleItens handle={handleDropdownChange} formItens={formItens} newRule={newRule} />
  <button className="formButton save-button" onClick={handleSave}>Salvar</button>
 </>
}

