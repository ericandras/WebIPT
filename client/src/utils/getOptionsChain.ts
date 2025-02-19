import { OptionField } from "../interfaces/chain";

const interfaceOptions: { value: string }[] = [
  { value: 'enp0s3' },
  { value: 'enp0s8' },
  { value: 'eth0'}
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
      requirement: (e) => e.includes('-p tcp') || e.includes('-p udp')
    },
    {
      command: '--sport', 
      type: 'text',
      placeholder: '20256',
      title: 'Porta de origem',
      info: 'Define a porta de origem.',
      requirement: (e) => (e.includes('-p tcp') || e.includes('-p udp')) // qual as outras condições para --sport?
    },
    {
      command: '--icmp-type',
      type: 'select',
      placeholder: 'tipo de mensagem ICMP',
      title: 'tipo de mensagem ICMP',
      info: 'Tipo de mensagem ICMP',
      options: [
                { value: 'echo-request' },
                { value: 'echo-reply' },
                { value: 'destination-unreachable' },
                { value: 'time-exceeded' },
                { value: 'parameter-problem' }
      ],
      requirement: (e) => (e.includes('-p icmp') && !(e.includes('-j RETURN')))
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
},
{
  command: '--log-prefix',
  title: 'prefixo personalizado',
  type: 'text',
  placeholder: 'LOG',
  info: 'Define um prefixo personalizado para a mensagem de log.'
},
{
  command: '--log-level',
  type: 'select',
  title: 'severidade',
  info: `emerg - 0: Situação crítica que torna o sistema inutilizável
alert - 1: Problema grave que requer ação imediata
crit - 2: Condição crítica que pode causar falha no sistema
err - 3:Erro que impede o funcionamento correto
warning - 4: Alerta sobre algo incomum, mas sem impacto imediato 
notice - 5: Mensagem informativa que pode indicar um problema futuro
info - 6: Informações gerais sobre a atividade do sistema
debug = 7: Detalhes de depuração para análise técnica
`,
  options: [
    { value: 'emerg' },
    { value: 'alert' },
    { value: 'crit' },
    { value: 'err' },
    { value: 'warning' },
    { value: 'notice' },
    { value: 'info' },
    { value: 'debug' }
  ]
},
{
  command: '--log-tcp-sequence',
  type: 'checkbox',
  title: 'registrar sequência TCP',
  info: 'Registra o número de sequência TCP dos pacotes logados'
},
{
  command: '--set-mark',
  title: 'classificação do pacote',
  type: 'text',
  info: 'Define um valor numérico para classificar pacotes.'
},
{
  command: '--ttl-set',
  title: 'TTL',
  type: 'text',
  info: 'Modifica o valor TTL do pacote.'
},
{
  command: '--set-tos',
  title: 'TOS',
  type: 'text',
  info: 'Modifica o campo TOS no cabeçalho IP.'
},
{
  command: '--set-dscp',
  title: 'DSCP',
  type: 'text',
  info: 'Define a classe de serviço DSCP.'
},
{
  command: '--ecn-tcp-remove',
  title: 'ECN',
  type: 'checkbox',
  info: 'Remove os bits ECN do cabeçalho tcp (Explicit Congestion Notification).'
},
{
  command: '--selctx',
  title: 'ctx de segurança',
  type: 'text',
  info: 'Define um contexto de segurança.',
  placeholder: 'user:t_object:type:level'
},
{
  command: '--set-connmark',
  title: 'ctx de segurança',
  type: 'text',
  info: 'Define um valor numérico para classificar pacotes de conexões internas.',
  placeholder: 'user:t_object:type:level'
}

] as const satisfies OptionField[];

export type Command = (typeof optionsFieldLiteral)[number]['command'];

const optionsField = optionsFieldLiteral.map(item => ({ ...item })) as OptionField[];

export default function getOptionsChain(options: Command[]): OptionField[] {
  return optionsField.filter(option => options.includes(option.command as Command));
}