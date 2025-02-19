interface Props {
  info: string;
}
export default function({info} : Props) {
return  <div className="tooltip-container">
  <div className="tooltip-text">{info}</div>
</div>
}