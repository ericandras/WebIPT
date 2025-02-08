import { OptionField } from "../interfaces/chain";

const interfaceOptions: { value: string }[] = [
  { value: 'enp0s3' },
  { value: 'enp0s8' }
];
const protocolOptions: { value: string }[] = [
  { value: 'tcp' },
  { value: 'udp' },
  { value: 'icmp' }
];

const optionsFieldLiteral = [  
  {
    command: '-o', 
    type: 'select',
    options: interfaceOptions,
    placeholder: 'eth0',
    title: 'interface',
    info: 'Define a interface de saída pela qual o pacote será roteado.'
  },
  {
  command: '-p', 
  type: 'select',
  placeholder: 'tcp',
  options: protocolOptions,
  title: 'protocolo', 
  info: 'Especifica o protocolo de transporte.',
  optional: [
    {
      command: '--dport', 
      type: 'text',
      placeholder: '80',
      title: 'porta de destino',
      info: 'Especifica a porta de destino.',
      requirement: (e) => e.includes('-p tcp') || e.includes('-p tcp')
    },
    {
      command: '--sport', 
      type: 'text',
      placeholder: '20256',
      title: 'Porta de origem',
      info: 'Define a porta de origem.',
      requirement: (e) => (e.includes('-p tcp') || e.includes('-p tcp')) // qual as outras condições para --sport?
    },
    
  ]
},
{
  command: '-d',
  type: 'text',
  title: 'IP de destino',
  placeholder: '10.0.0.0/8',
  info: 'Especifica o endereço IP de destino (menos comum na POSTROUTING).'
},
{
  command: '-s', 
  type: 'text', 
  placeholder: '192.168.1.0/24', 
  title: 'IP de origem', 
  info: 'Especifica o endereço IP de origem ou uma sub-rede.'
}, 
{
  command: '-i', 
  type: 'select',
  options: interfaceOptions,
  placeholder: 'eth0',
  title: 'interface',
  info: 'Define a interface de entrada pela qual o pacote será roteado.'
},
{
  command: '--to-source', 
  type: 'select/text',
  options: [{value:'10.12.1.10'}], // trocar para apenas text depois
  placeholder: '203.0.113.1',
  title: 'IP substituido',
  info: 'Usado com o target SNAT para especificar o IP de origem que será substituído.',
  optional: [
    {  
      command: '--random', 
      type: 'checkbox',
      title: '--random?',
      info: 'Realiza a tradução do IP de origem de forma aleatória.',
      requirement: (e) => !e.includes('--persistent')
    },
    {  
      command: '--persistent',
      type: 'checkbox',
      title: '--persistent',
      info: 'Mantém o mesmo IP de origem traduzido para conexões consecutivas.',
      requirement: (e) => !e.includes('--random')
    },
  ],
},
{
  command: '--to-destination', 
  type: 'text',
  placeholder: '192.168.1.101:80',
  title: 'IP de redirecionamento',
  info: 'Especifica o endereço IP de destino.'
},

{
  command: '--reject-with',
  type: 'select',
  title: 'tipo de rejeição',
  info: 'Define qual tipo de resposta será enviada ao remetente do pacote rejeitado.',
  options: [
    { value: 'icmp-net-unreachable' },
    { value: 'icmp-host-unreachable' },
    { value: 'icmp-port-unreachable', requirement: (e) =>  e.includes('-p udp') },
    { value: 'icmp-proto-unreachable' },
    { value: 'icmp-admin-prohibited' },
    { value: 'tcp-reset', requirement : (e) =>  e.includes('-p tcp') },
    ]
}

] as const satisfies OptionField[];

export type Command = (typeof optionsFieldLiteral)[number]['command'];

const optionsField = optionsFieldLiteral.map(item => ({ ...item })) as OptionField[];

export default function getOptionsChain(options: Command[]): OptionField[] {
  return optionsField.filter(option => options.includes(option.command as Command));
}