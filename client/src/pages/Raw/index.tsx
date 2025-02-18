import SkeletonTable from "../../components/SkeletonTable"
import { ChainOptions } from "../../interfaces/chain"
import getOptionsChain from "../../utils/getOptionsChain"

function Raw() {
  const chainOptions: ChainOptions = {
    prerouting: {
      NOTRACK: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-i']),
        info: 'Desativa o rastreamento de conexão (conntrack) para pacotes correspondentes.',
      },
      ACCEPT: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-i']),
        info: 'Permite o pacote sem realizar modificações.',
      },
      DROP: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-i']),
        info: 'Descarta o pacote.',
      },
      RETURN: {
        required: getOptionsChain([]),
        optional: getOptionsChain([]),
        info: 'Retorna o controle para a chain anterior, sem modificar o pacote'
      }
    },
    output: {
      NOTRACK: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Desativa o rastreamento de conexão (conntrack) para pacotes correspondentes.',
      },
      ACCEPT: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Permite o pacote sem realizar modificações.',
      },
      DROP: {
        required: getOptionsChain([]),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Descarta o pacote.',
      },
      RETURN: {
        required: getOptionsChain([]),
        optional: getOptionsChain([]),
        info: 'Retorna o controle para a chain anterior, sem modificar o pacote'
      }
    }
  }
  return <SkeletonTable title="FILTER" chainOptions={chainOptions}/>
}

export default Raw
