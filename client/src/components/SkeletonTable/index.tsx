import React from "react"
import { useState, useEffect } from "react";
import sendMessage from "../../utils/messages";
import { useSocket } from "../../utils/socketContext";
import ChangeTableButton from "../changeTableButton/changeTableButton";
import Modal from "../Modal";
import Dropdown from "../dropdown";
import "./style.css";
import { Chain, ChainKey, ChainOptions, FormItem } from "../../interfaces/chain";

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

const title = "Regras NAT2"

export default function SkeletonTable() {
  const chains = Object.keys(chainOptions) as ChainKey[]


  const {socket, emitMessage} = useSocket();
  const [rules, setRules] = useState<string[]>([]);
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState(Array(5).fill(""));


  const [selectedAction, setSelectedAction] = useState('')

  const [formItens, setFormItens] = useState<FormItem[]>([])

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

  const handleSave = () => {
    
    const teste = `iptables -t nat -A ${selectedChain.toUpperCase()} -j ${newRule[0]}${newRule[1] == "TCP/UDP" ? "" : ` -p ${newRule[1]}`}${newRule[2]} `
    setIsModalOpen(false);
    console.log("Nova regra adicionada:", teste);
    sendMessage(socket,teste)
    emitMessage(table);
  };


   return (
    <section className="main-info">
    <div>
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

      <h1>{title}</h1>
      <div className="conteudo">
        <menu>
          {chains.map((btn) => (
            <ChangeTableButton
              key={btn}
              isSelected={selectedChain === btn}
              onSelect={() => setSelectedChain(btn)}
            >
              {btn.charAt(0).toUpperCase() + btn.slice(1)}
            </ChangeTableButton>
          ))}
        </menu>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Target</th>
              <th>Prot</th>
              <th>Opt</th>
              <th>Source</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {rule.trim().split(/\s+/).map((item, idx) => (
                  <td key={idx}>{item}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </section>
   )
}