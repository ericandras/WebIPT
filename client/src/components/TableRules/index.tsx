import React from "react"
import "./style.css"
import Rule from "./Rule"

interface Props {
  rules:string[]
}

export default function({rules}:Props) {

  const classtr= ["order-tr", "target-tr", "prot-tr", "opt-tr", "source-tr", "destination-tr"]
  return (   
    <div className="rule-table-wrapper">    
  <div className="rule-table-header">
        <div className={`rule-tr order-tr`}>#</div>
        <div className={"rule-tr target-tr"}>Target</div>
        <div className={"rule-tr prot-tr"}>Prot</div>
        <div className={"rule-tr " + classtr[3]}>Opt</div>
        <div className={"rule-tr " + classtr[4]}>Source</div>
        <div className={"rule-tr " + classtr[5]}>Destination</div>
        <div className={"rule-tr " + "edit-tr"}>Edit</div>
    </div>

    <div className="rule-table-body" style={{display: rules.length > 0 ? 'block' : 'none'}}>
      {rules.map((rule, index) => {
        return <Rule rule={rule} index={index} classtr={classtr} rulesLength={rules.length}/>
      })}
    </div>
  </div> )
}