import React from "react"
import { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext/socketContext";
import ChangeTableButton from "../ChainButtons";
import Modal from "../Modal";
import Dropdown from "../dropdown";
import "./style.css";
import { Chain, ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";
import TableRules from "../TableRules";
import AddRuleButton from "../AddRuleButton";
import ChainButtons from "../ChainButtons";

const chainOptions:ChainOptions = {
  postrouting: {
    masquerade: {
      required: [
        {
          command: '-s', 
          type: 'text', 
          placeholder: '192.168.1.0/24', 
          title: 'IP de origem', 
          info: 'Especifica o endereço IP de origem ou uma sub-rede.'
        }, 
        {
          command: '-o', 
          type: 'select',
          options: ['enp0s3', 'enp0s8'],
          placeholder: 'eth0',
          title: 'interface',
          info: 'Define a interface de saída pela qual o pacote será roteado.'
        }
      ],
      optional: [
        {
          command: '-d',
          type: 'select/text',
          options: ['localhost'],
          title: 'IP de destino',
          placeholder: '10.0.0.0/8',
          info: 'Especifica o endereço IP de destino (menos comum na POSTROUTING).'
        }
      ],
      info: 'Realiza mascaramento do IP de origem, usado em conexões dinâmicas (ex.: NAT para internet).',
    },
    snat: {
      required: [
        {
          command: '-s', 
          type: 'text', 
          placeholder: '192.168.1.0/24', 
          title: 'IP de origem', 
          info: 'Especifica o endereço IP de origem ou uma sub-rede.'
        }, 
        {
          command: '-o', 
          type: 'select',
          options: ['enp0s3', 'enp0s8'],
          placeholder: 'eth0',
          title: 'interface',
          info: 'Define a interface de saída pela qual o pacote será roteado.'
        },
        {
          command: '--to-source', 
          type: 'select/text',
          options: ['localhost'],
          placeholder: '203.0.113.1',
          title: 'IP substituido',
          info: 'Usado com o target SNAT para especificar o IP de origem que será substituído.',
          optional: [
            {  
              command: '--random', 
              type: 'checkbox',
              title: 'randomizar?',
              info: 'Realiza a tradução do IP de origem de forma aleatória.',
            }
          ]
        }
      ],
    }
  },
  output: {}
}

const title = "NAT"

export default function SkeletonTable() {
  const chains = Object.keys(chainOptions) as ChainKey[]

  const {socket, emitMessage} = useSocket();
  const [rules, setRules] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState(chains[0]);

  const selectedIterface = "enp0s3"
  const dropdownOptions = [
    ["ACCEPT", "DROP", "REJECT","LOG","QUEUE","RETURN"], 
    ["TCP/UDP", "TCP", "UDP"],
    ["", "", ""], 
  ];

  const table = `iptables -t nat -L ${selectedChain.toUpperCase()}`;

  useEffect(() => {
    emitMessage(table);
    socket.on("output_command", (data) => {
      const filteredRules = extractRules(data.lines);
      setRules(filteredRules);
    });

    return () => {
      socket.off("output_command");
    };
  }, [socket, table]);

  const extractRules = (lines:string[]) =>
    lines.filter((line) => !line.startsWith("Chain") && !line.startsWith("target"));

   return (
    <section className="main-info">
    <div>
      <AddRuleButton selectedChain={selectedChain} chainOptions={chainOptions} table={table}/>
      <h1>{title}</h1>
      <div className="conteudo">
        <ChainButtons selected={selectedChain} onSelect={setSelectedChain} chains={chains}/>
        <TableRules rules={rules} />
      </div>
    </div>
    </section>
   )
}