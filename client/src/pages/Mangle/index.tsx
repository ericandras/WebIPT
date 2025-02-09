import SkeletonTable from "../../components/SkeletonTable";
import { ChainOptions } from "../../interfaces/chain";

function Mangle() {
  const chainOptions:ChainOptions = {
    
  }
  return <SkeletonTable title="FILTER" chainOptions={chainOptions}/>
}

export default Mangle;
