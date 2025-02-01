import { useEffect, useState } from "react";
import Modal from "../Modal";
import { ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";
import Dropdown from "../dropdown";
import { useSocket } from "../../utils/socketContext";
import sendMessage from "../../utils/messages";

interface Props {
  selectedChain: ChainKey;
  chainOptions: ChainOptions;
  table: string
}

export default function({selectedChain, chainOptions, table} : Props) {
    const {socket, emitMessage} = useSocket();

    const [newRule, setNewRule] = useState(Array(5).fill(""));
    const [selectedAction, setSelectedAction] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    sendMessage(socket,teste)
    emitMessage(table);
  };


  const handleDropdownChange = (index:number, value:any) => {
    const updatedRule = [...newRule];
    updatedRule[index] = value;
    setNewRule(updatedRule);
  };

  const renderDropdowns = () => {
    return formItens.map((item, index) => {
      switch (item.type) {
        case 'select':
          return <td key={index} className="teste">
          <Dropdown
            options={item.options??[]} 
            value={newRule[index]} 
            onChange={(val) => handleDropdownChange(index, val)} 
            placeholder="Escolha uma regra"
          />
        </td>
      }
    }
      
    );
  };


  
  return (<>
      <div className="newRule">
        <button onClick={() => setIsModalOpen(true)}>Adicionar Regra</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Adicionar Nova Regra {selectedChain.toUpperCase()}</h2>
        <table>
          <tbody>
            <tr>{renderDropdowns()}</tr>
          </tbody>
        </table>
        <button onClick={handleSave}>Salvar</button>
      </Modal>
      </>)
}