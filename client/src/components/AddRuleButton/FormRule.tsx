import { useEffect, useState } from "react";
import { ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";
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

  const [newRule, setNewRule] = useState(Array(5).fill(""));
  const [selectedAction, setSelectedAction] = useState('');
  const [formItens, setFormItens] = useState<FormItem[]>([]);

  useEffect(() => {
    const form = []
    const targets:FormItem = {
      required: true,
      command: '-j',
      type: 'select',
      title: 'ação',
      info: 'Ação a ser realizada',
      options: Object.keys(chainOptions[selectedChain]!)
    }
    form.push(targets)
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
  <button onClick={handleSave}>Salvar</button>
 </>
}

