import SkeletonTable from "../../components/SkeletonTable"
import { ChainOptions } from "../../interfaces/chain"
import getOptionsChain from "../../utils/getOptionsChain"

function Raw() {
  const chainOptions: ChainOptions = {
    prerouting: {
      NOTRACK: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Desativa o rastreamento de conexão (conntrack) para pacotes correspondentes.',
      },

    }
  }
  return <SkeletonTable title="FILTER" chainOptions={chainOptions}/>
}

export default Raw
