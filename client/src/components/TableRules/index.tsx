import React from "react"
import "./style.css"

interface Props {
  rules:string[]
}

export default function({rules}:Props) {
  return (        
  <table className="rule-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Target</th>
        <th>Prot</th>
        <th>Opt</th>
        <th>Source</th>
        <th>Destination</th>
        <th>Edit</th>
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
  </table>)
}