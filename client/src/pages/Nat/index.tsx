import SkeletonTable from "../../components/SkeletonTable";
import { ChainOptions, OptionField } from "../../interfaces/chain";
import getOptionsChain from "../../utils/getOptionsChain";


const chainOptions: ChainOptions = {
  postrouting: {
    MASQUERADE: {
      required: getOptionsChain(['-o']),
      optional: getOptionsChain(['-d', '-s']),
      info: 'Realiza mascaramento do IP de origem, usado em conexões dinâmicas (ex.: NAT para internet).',
    },
    SNAT: {
      required: getOptionsChain(['-s', '-o', '--to-source']),
      optional: getOptionsChain(['-d'])
    },
    ACCEPT: {
      required: [],
      optional: getOptionsChain(['-d', '-s', '-o']),
      info: 'Permite o pacote sem realizar modificações.',
    },
    DROP: {
      required: [],
      optional: getOptionsChain(['-d', '-s', '-o']),
      info: 'Descarta o pacote.',
    },
    RETURN: {
      required: [],
      optional: getOptionsChain(['-d', '-s', '-o']),
      info: 'Retorna o controle para a chain anterior, sem modificar o pacote.',
    }
  },
  prerouting: {
    DNAT: {
      required: getOptionsChain(['-p', '--dport', '--to-destination']),
      optional: getOptionsChain(['-d', '-s', '-i']),
      info: 'Altera o endereço IP de destino de um pacote (Destination NAT).'
    },
    ACCEPT: {
      required: [],
      optional: getOptionsChain(['-p', '--dport', '--to-destination', '-d', '-s', '-i']),
      info: 'Permite o pacote sem realizar modificações.',
    },
    DROP: {
      required: [],
      optional: getOptionsChain(['-p', '--dport', '--to-destination', '-d', '-s', '-i']),
      info: 'Descarta o pacote.',
    },
    RETURN: {
      required: [],
      optional: getOptionsChain(['-p', '--dport', '--to-destination', '-d', '-s', '-i']),
      info: 'Retorna o controle para a chain anterior, sem modificar o pacote.'
    }
  },
  output: {
    DNAT: {
      required: [],
      optional: getOptionsChain(['-p', '-s', '-d', '--dport','--sport', '-o']),
      info: 'Permite o pacote seguir seu destino normalmente'
    },
    MASQUERADE: {
      required: [],
      optional: getOptionsChain(['-p', '-s', '-d', '--dport','--sport', '-o']),
      info: 'Descarta o pacote, mas envia uma mensagem ICMP de erro ao remetente.',
    },
    ACCEPT: {
      required: [],
      optional: getOptionsChain(['-p', '-s', '-d', '--dport','--sport', '-o']),
      info: 'Retorna o controle para a chain anterior. Se for uma chain principal, aplica a policy default.',
    },
    LOG: {
      required: [],
      optional: getOptionsChain(['-p', '-s', '-d', '--dport','--sport', '-o']),
      info: 'Loga informações sobre o pacote no syslog, sem interromper o fluxo',
    }
    
  }
}

function Nat() {
  return <SkeletonTable title="NAT" chainOptions={chainOptions}/>
}

export default Nat;
