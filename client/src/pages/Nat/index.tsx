import SkeletonTable from "../../components/SkeletonTable";
import { ChainOptions } from "../../interfaces/chain";

const chainOptions:ChainOptions = {
  postrouting: {
    MASQUERADE: {
      required: [
        {
          command: '-s', 
          type: 'text', 
          placeholder: '192.168.1.0/24', 
          title: 'IP de origem', 
          info: 'Especifica o endereço IP de origem ou uma sub-rede.'
        }, 
        {
          command: '-o', 
          type: 'select',
          options: ['enp0s3', 'enp0s8'],
          placeholder: 'eth0',
          title: 'interface',
          info: 'Define a interface de saída pela qual o pacote será roteado.'
        }
      ],
      optional: [
        {
          command: '-d',
          type: 'select/text',
          options: ['localhost', 'anywhere'],
          title: 'IP de destino',
          placeholder: '10.0.0.0/8',
          info: 'Especifica o endereço IP de destino (menos comum na POSTROUTING).'
        }
      ],
      info: 'Realiza mascaramento do IP de origem, usado em conexões dinâmicas (ex.: NAT para internet).',
    },
    SNAT: {
      required: [
        {
          command: '-s', 
          type: 'text', 
          placeholder: '192.168.1.0/24', 
          title: 'IP de origem', 
          info: 'Especifica o endereço IP de origem ou uma sub-rede.'
        }, 
        {
          command: '-o', 
          type: 'select',
          options: ['enp0s3', 'enp0s8'],
          placeholder: 'eth0',
          title: 'interface',
          info: 'Define a interface de saída pela qual o pacote será roteado.'
        },
        {
          command: '--to-source', 
          type: 'select/text',
          options: ['localhost'],
          placeholder: '203.0.113.1',
          title: 'IP substituido',
          info: 'Usado com o target SNAT para especificar o IP de origem que será substituído.',
          optional: [
            {  
              command: '--random', 
              type: 'checkbox',
              title: 'randomizar?',
              info: 'Realiza a tradução do IP de origem de forma aleatória.',
            }
          ]
        }
      ],
    }
  },
  output: {}
}

function Nat() {
  return <SkeletonTable title="NAT" chainOptions={chainOptions}/>
}

export default Nat;
