import { useState, useEffect } from "react";
import sendMessage from "../../utils/messages";
import { useSocket } from "../../utils/socketContext";
import ChangeTableButton from "../changeTableButton/changeTableButton";
import Modal from "../modal/modal";
import Dropdown from "../dropdown/dropdown";
import "./nat.css";

function Nat() {
  const {socket, emitMessage} = useSocket();
  const [rules, setRules] = useState([]);
  const [tableSelected, setTableSelected] = useState("postrouting");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState(Array(5).fill(""));
  const selectedIterface = "enp0s3"

  const dropdownOptions = [
    ["ACCEPT", "DROP", "REJECT","LOG","QUEUE","RETURN"], 
    ["TCP/UDP", "TCP", "UDP"],
    ["", "", ""], 
  ];

  const table = `iptables -t nat -L ${tableSelected.toUpperCase()}`;

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

  const extractRules = (lines) =>
    lines.filter((line) => !line.startsWith("Chain") && !line.startsWith("target"));

 

  const handleDropdownChange = (index, value) => {
    const updatedRule = [...newRule];
    updatedRule[index] = value;
    setNewRule(updatedRule);
  };

  const renderDropdowns = () => {
    return dropdownOptions.map((options, index) => (
      <td key={index} className="teste">
        <Dropdown
          options={options} 
          value={newRule[index]} 
          onChange={(val) => handleDropdownChange(index, val)} 
          placeholder="Escolha uma regra"
        />
      </td>
    ));
  };

  const handleSave = () => {
    
    const teste = `iptables -t nat -A ${tableSelected.toUpperCase()} -j ${newRule[0]}${newRule[1] == "TCP/UDP" ? "" : ` -p ${newRule[1]}`}${newRule[2]} `
    setIsModalOpen(false);
    console.log("Nova regra adicionada:", teste);
    sendMessage(socket,teste)
    emitMessage(table);
  };
  return (
    <div>
      <div className="newRule">
        <button onClick={() => setIsModalOpen(true)}>Adicionar Regra</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Adicionar Nova Regra {tableSelected.toUpperCase()}</h2>
        <table>
          <tbody>
            <tr>{renderDropdowns()}</tr>
          </tbody>
        </table>
        <button onClick={handleSave}>Salvar</button>
      </Modal>

      <h1>Regras NAT</h1>
      <div className="conteudo">
        <menu>
          {["postrouting", "prerouting", "output"].map((btn) => (
            <ChangeTableButton
              key={btn}
              isSelected={tableSelected === btn}
              onSelect={() => setTableSelected(btn)}
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
  );
}

export default Nat;
