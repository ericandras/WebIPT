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
      LOG:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '--log-prefix', '--log-level', '--log-tcp-sequence']),
      },
      RETURN:{
        required:[],
        optional: [],
        info: 'Retorna o controle para a chain anterior, sem modificar o pacote.',
      }
    },
    output: {
      ACCEPT: {
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o']),
        info: 'Permite o tráfego do pacote sem realizar modificações.',
      },
      DROP:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o']),
        info: 'Descarta o pacote sem informar o remetente.',
      },
      REJECT:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o', '--reject-with',]),
        info: 'Bloqueia o pacote e envia uma resposta ao remetente.',
      },
      LOG:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o','--log-prefix', '--log-level', '--log-tcp-sequence' ]),
      },
      RETURN:{
        required:[],
        optional: [],
        info: 'Retorna o controle para a chain anterior, sem modificar o pacote.',
      }
    },
    forward: {
      ACCEPT: {
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o']),
        info: 'Permite o tráfego do pacote sem realizar modificações.',
      },
      DROP:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o']),
        info: 'Descarta o pacote sem informar o remetente.',
      },
      REJECT:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o', '--reject-with',]),
        info: 'Bloqueia o pacote e envia uma resposta ao remetente.',
      },
      LOG:{
        required:[],
        optional: getOptionsChain(['-p', '-s', '-d', '-i', '-o','--log-prefix', '--log-level', '--log-tcp-sequence' ]),
      },
      RETURN:{
        required:[],
        optional: [],
        info: 'Retorna o controle para a chain anterior, sem modificar o pacote.',
      }
    }
  }
  return <SkeletonTable title="FILTER" chainOptions={chainOptions}/>
}

export default Filter
