import React, { useCallback } from "react"
import { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext/socketContext";
import ChangeTableButton from "../ChainButtons";
import Modal from "../Modal";
import Dropdown from "../Dropdown";
import "./style.css";
import { Chain, ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";
import TableRules from "../TableRules";
import AddRuleButton from "../AddRuleButton";
import ChainButtons from "../ChainButtons";
import { TableProvider, useTable } from "../../contexts/TableContext";

interface Props {
  title: string;
  chainOptions: ChainOptions;
}

export default function SkeletonTable({title, chainOptions} : Props) {
  const chains = Object.keys(chainOptions) as ChainKey[]
  if(chains.length === 0) return null;

  const {socket, emitMessage} = useSocket();
  const {setTable, setChain} = useTable()
  const [rules, setRules] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState(chains[0]);

  const selectedIterface = "enp0s3"

  const table = `iptables -t ${title.toLowerCase()} -L ${selectedChain.toUpperCase()} -n`;

  function compareArrays(arr1:string[], arr2:string[]) {
    return arr1.length === arr2.length && arr1.every((valor, index) => valor === arr2[index]);
  } 

  const extractRules = (lines:string[]) =>
    lines.filter((line) => !line.startsWith("Chain") && !line.startsWith("target"));


  const updateRules = useCallback((res: { table: string, chain: string, lines: string[] }) => {
    if (res.table === title.toLowerCase() && res.chain === selectedChain.toUpperCase()) {
      const filteredRules = extractRules(res.lines);
      if (!compareArrays(filteredRules, rules)) {
        setRules(filteredRules);
      }
    }
  }, [rules, title, selectedChain, setRules]);

  useEffect(() => {
    socket.on('update_rules', updateRules);
    return () => {
      socket.off('update_rules', updateRules);
    };
  }, [updateRules]);

  useEffect(() => {
    emitMessage(table);
    setTable(title.toLowerCase())
    setChain(selectedChain.toUpperCase())
    socket.on("output_command", (data) => {
      const filteredRules = extractRules(data.lines);
      setRules(filteredRules);
    });

    socket.emit('define_table', {table: title.toLowerCase(), chain: selectedChain.toUpperCase()})

    return () => {
      socket.off("output_command");
    };
  }, [socket, table]);



   return (
      <section className="main-info">
      <div className="container">
        <AddRuleButton selectedChain={selectedChain} chainOptions={chainOptions} table={title.toLowerCase()}/>
        <h1 className="title-chain">{title}</h1>
        <div className="conteudo">
          <ChainButtons selected={selectedChain} onSelect={setSelectedChain} chains={chains}/>
          <TableRules rules={rules} />
        </div>
      </div>
      </section>
   )
}