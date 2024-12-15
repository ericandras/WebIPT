import { useState, useEffect } from "react";
import sendMessage from "../../utils/messages";
import { useSocket } from "../../utils/socketContext";
import ChangeTableButton from "../changeTableButton/changeTableButton";
import Modal from "../modal/modal";
import './nat.css'

function Nat() {
  const socket = useSocket();
  const [rules, setRules] = useState([]);
  const [table, setTable] = useState()
  const [tableSelected, setTableSelected] = useState('postrouting')
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!table) return;

    sendMessage(socket, table);

    socket.on("output_command", (data) => {
      const filteredRules = extractRules(data.lines);
      setRules(filteredRules);
    });

    return () => {
      socket.off("output_command");
    };
  }, [socket, table]);


  const extractRules = (lines) => {
    return lines.filter(line => !line.startsWith("Chain") && !line.startsWith("target"));
  };

  function handleSelect(buttonActive) {
    setTable(`iptables -t nat -L ${buttonActive.toUpperCase()}`)
    setTableSelected(buttonActive)
  }
  return (

    <div>
      <div className="newRule">
        <button onClick={() => setIsModalOpen(true)}>Adicionar Regra</button>
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h2>Adicionar Nova Regra {tableSelected.toUpperCase()}</h2>
        <table>
          <tr>
            <td className="teste">
              <select className="dropdown">
                <option value="Option 1" >Option 1</option>
                <option value="Option 2" >Option 2</option>
                <option value="me" >Option 3</option>
              </select>
            </td>
            <td className="teste">
              <select className="dropdown">
                <option value="Option 1" >Option 1</option>
                <option value="Option 2" >Option 2</option>
                <option value="me" >Option 3</option>
              </select>
            </td>
            <td className="teste">
              <select className="dropdown">
                <option value="Option 1" >Option 1</option>
                <option value="Option 2" >Option 2</option>
                <option value="me" >Option 3</option>
              </select>
            </td> <td className="teste">
              <select className="dropdown">
                <option value="Option 1" >Option 1</option>
                <option value="Option 2" >Option 2</option>
                <option value="me" >Option 3</option>
              </select>
            </td>
            <td className="teste">
              <select className="dropdown">
                <option value="Option 1" >Option 1</option>
                <option value="Option 2" >Option 2</option>
                <option value="me" >Option 3</option>
              </select>
            </td>
          </tr>
        </table>
        <button onClick={() => setIsModalOpen(false)}>Salvar</button>
      </Modal>
      <h1>Regras NAT</h1>
      <div className="conteudo">
        <menu>
          <ChangeTableButton isSelected={tableSelected === 'postrouting'} onSelect={() => handleSelect('postrouting')}>Postrouting</ChangeTableButton>
          <ChangeTableButton isSelected={tableSelected === 'prerouting'} onSelect={() => handleSelect('prerouting')}>Prerouting</ChangeTableButton>
          <ChangeTableButton isSelected={tableSelected === 'output'} onSelect={() => handleSelect('output')}>Output</ChangeTableButton>


        </menu>
        <div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Target</th>
                <th>Prot</th>
                <th>Opt</th>
                <th>source</th>
                <th>destination</th>
              </tr>
            </thead>

            <tbody>

              {
                rules.map((rule, index) => (
                  <tr key={index}>
                    <td>{(++index)}</td>
                    {rule.trim().split(/\s+/).map(e => <td>{e}</td>)}
                  </tr>
                ))

              }
            </tbody>
          </table>

        </div>


      </div>

    </div>
  );
}

export default Nat;
