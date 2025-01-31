import { useState, useEffect } from "react";
import sendMessage from "../../utils/messages";
import { useSocket } from "../../utils/socketContext";
import ChangeTableButton from "../changeTableButton/changeTableButton";
import Modal from "../Modal";
import Dropdown from "../dropdown";
import "./nat.css";

function Nat() {
  const socket = useSocket();
  const [rules, setRules] = useState([]);
  const [tableSelected, setTableSelected] = useState("postrouting");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState(Array(5).fill(""));


  const dropdownOptions = [
    ["Option A1", "Option A2", "Option A3"], 
    ["Option B1", "Option B2", "Option B3"], 
    ["Option C1", "Option C2", "Option C3"], 
    ["Option D1", "Option D2", "Option D3"], 
    ["Option E1", "Option E2", "Option E3"], 
  ];

  const table = `iptables -t nat -L ${tableSelected.toUpperCase()}`;

  useEffect(() => {
    sendMessage(socket, table);
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

  const handleSave = () => {
    console.log("Nova regra adicionada:", newRule);
    setIsModalOpen(false);
  };

  const handleDropdownChange = (index, value) => {
    const updatedRule = [...newRule];
    updatedRule[index] = value;
    setNewRule(updatedRule);
  };

  const renderDropdowns = () => {
    return dropdownOptions.map((options, index) => (
      <td key={index} className="teste">
        <Dropdown
          options={options} // Passa opções específicas para este Dropdown
          value={newRule[index]} // O valor selecionado neste Dropdown
          onChange={(val) => handleDropdownChange(index, val)} // Atualiza o estado correspondente
        />
      </td>
    ));
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
