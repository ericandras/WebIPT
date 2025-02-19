import { useEffect, useState } from "react";
import { useTable } from "../../contexts/TableContext";
import { useSocket } from "../../contexts/SocketContext/socketContext";

interface Props {
  rule: string; 
  index: number
  classtr: string[]
  rulesLength: number
}

export default function ({rule, classtr, index, rulesLength}: Props) {

  const [editing, setEditing] = useState(false)
  const {table, chain} = useTable()
  const {emitMessage} = useSocket()


  const handleEdit = () => {
    setEditing(!editing)
  }

  useEffect(() => {
    setEditing(false)
  }, [rule, index, classtr, rulesLength])

  const handleUp = () => {
    console.log('table:', table, 'chain:',chain)
   const o = `iptables -t ${table} -S ${chain} | sed -n '${index + 2}p' | sed -E 's/^-A ${chain}/-I ${chain} ${index}/' | xargs iptables -t ${table}`
   const removeRUle = `iptables -t ${table} -D ${chain} ${index+1}`
   console.log('o')
   emitMessage(o)
   emitMessage(removeRUle)
  }

  const handleDown = () => {
    console.log('table:', table, 'chain:',chain)
   const o = `regra=$(iptables -t ${table} -S ${chain} | sed -n '${index + 2}p' | sed -E 's/^-A ${chain}/-I ${chain} ${index+2}/') && iptables -t ${table} -D ${chain} ${index} &&  echo "$regra" | xargs iptables -t ${table}`
  //  const removeRUle = ``
   console.log('o')
   emitMessage(o)
  //  emitMessage(removeRUle)
  }

  const handleRemove = () => {
   const removeRUle = `iptables -t ${table} -D ${chain} ${index+1}`
   emitMessage(removeRUle)
  }

  return <div className="rule-table-line" key={index}>
  <div className={"rule-tr "+classtr[0]}>{index + 1}</div>
  {rule.trim().split(/\s+/).map((item, idx) => (
    <div className={`rule-tr ${classtr[idx + 1]??'addtional'}`} key={idx}>{item}</div>
  ))}
   {editing ? <div className={`rule-tr edit-tr open`}> 
    <div className="edit-up" onClick={handleUp}></div>
    <div className="edit-down" onClick={handleDown}></div>
    <div className="edit-delete" onClick={handleRemove}></div>
    <div className="edit-close" onClick={handleEdit}></div>
   </div> : <div className={`rule-tr edit-tr`} onClick={handleEdit} /> }
</div>
}