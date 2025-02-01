import { useEffect, useState } from "react";
import Modal from "../Modal";
import { ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";
import Dropdown from "../Dropdown";
import { useSocket } from "../../contexts/SocketContext/socketContext";
import sendMessage from "../../contexts/SocketContext/messages";
import './style.css'
import FormRule from "./FormRule";

interface Props {
  selectedChain: ChainKey;
  chainOptions: ChainOptions;
  table: string
}

export default function({selectedChain, chainOptions, table} : Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (<>
      <div className="newRule">
        <button onClick={() => setIsModalOpen(true)}>Adicionar Regra</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormRule selectedChain={selectedChain} setIsModalOpen={setIsModalOpen} table={table} chainOptions={chainOptions}/>
      </Modal>
      </>)
}