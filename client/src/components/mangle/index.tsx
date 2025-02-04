//@ts-nocheck
import { useState, useEffect } from "react";
import sendMessage from "../../contexts/SocketContext/messages";
import { useSocket } from "../../contexts/SocketContext/socketContext";
import ChangeTableButton from "../ChainButtons";

function Mangle() {
  const {socket} = useSocket();
  const [rules, setRules] = useState([]);
  const [table, setTable] = useState()
  const [tableSelected, setTableSelected] = useState('postrouting')
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
    setTable(`iptables -t mangle -L ${buttonActive.toUpperCase()}`)
    setTableSelected(buttonActive)
  }
  return (
    <div>
      <h1>Regras MANGLE</h1>
      <div  className="conteudo">
      <menu>
        <ChangeTableButton isSelected={tableSelected === 'postrouting'} onSelect={() => handleSelect('postrouting')}>Postrouting</ChangeTableButton>
        <ChangeTableButton isSelected={tableSelected === 'prerouting'} onSelect={() => handleSelect('prerouting')}>Prerouting</ChangeTableButton>
        <ChangeTableButton isSelected={tableSelected === 'output'} onSelect={() => handleSelect('output')}>Output</ChangeTableButton>
        <ChangeTableButton isSelected={tableSelected === 'input'} onSelect={() => handleSelect('input')}>Input</ChangeTableButton>

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

export default Mangle;
