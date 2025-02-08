import SkeletonTable from '../../components/SkeletonTable'
import { ChainOptions } from '../../interfaces/chain'
import getOptionsChain from '../../utils/getOptionsChain'

function Filter() {
  const chainOptions: ChainOptions = {
    input: {
      ACCEPT: {
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i']),
        info: 'Permite o tráfego do pacote sem realizar modificações.',
      },
      DROP:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i']),
        info: 'Descarta o pacote sem informar o remetente.',
      },
      REJECT:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '--reject-with']),
        info: 'Bloqueia o pacote e envia uma resposta ao remetente.',
      },
      LOG:{},
      RETURN:{}
    },
    output: {},
    forward: {}
  }
  return <SkeletonTable title="FILTER" chainOptions={chainOptions}/>
}

export default Filter
