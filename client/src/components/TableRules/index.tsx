import React from "react"
import "./style.css"

interface Props {
  rules:string[]
}

export default function({rules}:Props) {
  const classtr= ["order-tr", "target-tr", "prot-tr", "opt-tr", "source-tr", "destination-tr", "edit-tr"]

  return (   
    <div className="rule-table-wrapper">    
  <div className="rule-table-header">
        <div className={`rule-tr order-tr`}>#</div>
        <div className={"rule-tr target-tr"}>Target</div>
        <div className={"rule-tr prot-tr"}>Prot</div>
        <div className={"rule-tr " + classtr[3]}>Opt</div>
        <div className={"rule-tr " + classtr[4]}>Source</div>
        <div className={"rule-tr " + classtr[5]}>Destination</div>
        {/* <div className={"rule-tr "}>...</div> */}
        <div className={"rule-tr " + "edit-tr"}>Edit</div>
    </div>

    <div className="rule-table-body" style={{display: rules.length > 0 ? 'block' : 'none'}}>
      {rules.map((rule, index) => {
        return (
        <div className="rule-table-line" key={index}>
          <div className={"rule-tr "+classtr[0]}>{index + 1}</div>
          {rule.trim().split(/\s+/).map((item, idx) => (
            <div className={`rule-tr ${classtr[idx + 1]??''}`} key={idx}>{item}</div>
          ))}
           <div className={`rule-tr edit-tr`} />
        </div>
        )
      })}
    </div>
  </div> )
}