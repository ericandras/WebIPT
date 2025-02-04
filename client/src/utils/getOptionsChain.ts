import { OptionField } from "../interfaces/chain";

const interfaceOptions = ['enp0s3', 'enp0s8'];

const optionsFieldLiteral = [  
  {
    command: '-o', 
    type: 'select',
    options: ['enp0s3', 'enp0s8'],
    placeholder: 'eth0',
    title: 'interface',
    info: 'Define a interface de saída pela qual o pacote será roteado.'
  },
  {
  command: '-p', 
  type: 'select',
  placeholder: 'tcp',
  options: ['tcp', 'udp', 'icmp'],
  title: 'protocolo', 
  info: 'Especifica o protocolo de transporte.'
},
{
  command: '--dport', 
  type: 'text',
  placeholder: '80',
  title: 'porta de destino',
  info: 'Especifica a porta de destino.'
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
  options: ['10.12.1.10'], // trocar para apenas text depois
  placeholder: '203.0.113.1',
  title: 'IP substituido',
  info: 'Usado com o target SNAT para especificar o IP de origem que será substituído.',
  optional: [
    {  
      command: '--random', 
      type: 'checkbox',
      title: '--random?',
      info: 'Realiza a tradução do IP de origem de forma aleatória.',
    },
    {  
      command: '--persistent',
      type: 'checkbox',
      title: '--persistent',
      info: 'Mantém o mesmo IP de origem traduzido para conexões consecutivas.'
    },
  ],
},
{
  command: '--to-destination', 
  type: 'text',
  placeholder: '192.168.1.101:80',
  title: 'IP de destino',
  info: 'Especifica o endereço IP de destino.'
},
{
  command: '--sport', 
  type: 'text',
  placeholder: '20256',
  title: 'Porta de origem',
  info: 'Define a porta de origem.'
},

] as const satisfies OptionField[];

export type Command = (typeof optionsFieldLiteral)[number]['command'];

const optionsField = optionsFieldLiteral.map(item => ({ ...item })) as OptionField[];

export default function getOptionsChain(options: Command[]): OptionField[] {
  return optionsField.filter(option => options.includes(option.command as Command));
}