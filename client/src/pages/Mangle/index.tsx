import SkeletonTable from "../../components/SkeletonTable";
import { ChainOptions } from "../../interfaces/chain";
import getOptionsChain from "../../utils/getOptionsChain";

function Mangle() {
  const chainOptions: ChainOptions = {
    prerouting: {
      MARK: {
        required: getOptionsChain(['--set-mark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Atribui marcas a pacotes para manipulação posterior.',
      },
      TTL:{
        required:getOptionsChain(['--ttl-set']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Altera o campo TTL dos pacotes.',
      },
      TOS:{
        required:getOptionsChain(['--set-tos']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Modifica o campo TOS no cabeçalho IP.',
      },
      DSCP:{
        required:getOptionsChain(['--set-dscp']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define a classe de serviço para QoS.'
      },
      ECN:{
        required:getOptionsChain(['--ecn-tcp-remove']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Modifica o campo Explicit Congestion Notification.',
      }
    },
    input: {
      MARK: {
        required:getOptionsChain(['--set-mark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Atribui marcas a pacotes destinados ao host.',
      },
      DSCP: {
        required:getOptionsChain(['--set-dscp']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define a classe de serviço para priorização.'
      },
      SECMARK: {
        required:getOptionsChain(['--selctx']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define um rótulo de segurança.',
      }
    },
    forward: {
      MARK: {
        required:getOptionsChain(['--set-mark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Atribui marcas a pacotes encaminhados.',
      },
      DSCP: {
        required:getOptionsChain(['--set-dscp']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define a classe de serviço para priorização.'
      },
      CONNMARK: {
        required:getOptionsChain(['--set-connmark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'marca conexões inteiras.',
      }
    },
    output: {
      MARK: {
        required:getOptionsChain(['--set-mark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Atribui marcas a pacotes gerados pelo host.',
      },
      TTL:{
        required:getOptionsChain(['--ttl-set']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Altera o campo TTL de pacotes saindo do host.',
      },
      DSCP: {
        required:getOptionsChain(['--set-dscp']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define a classe de serviço.'
      },
      TOS:{
        required:getOptionsChain(['--set-tos']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Modifica o campo TOS no cabeçalho IP.',
      },
      SECMARK: {
        required:getOptionsChain(['--selctx']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define um rótulo de segurança.',
      },
      ECN:{
        required:getOptionsChain(['--ecn-tcp-remove']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Modifica o campo Explicit Congestion Notification.',
      }
    },
    postrouting: {
      MARK: {
        required: getOptionsChain(['--set-mark']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Atribui marcas a pacotes após o roteamento.',
      },
      TTL:{
        required:getOptionsChain(['--ttl-set']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Altera o campo TTL de pacotes saindo.',
      },
      DSCP:{
        required:getOptionsChain(['--set-dscp']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Define a classe de serviço.'
      },
      ECN:{
        required:getOptionsChain(['--ecn-tcp-remove']),
        optional: getOptionsChain(['-p', '-s', '-d', '-o']),
        info: 'Modifica o campo Explicit Congestion Notification.',
      }
    },
  }
  return <SkeletonTable title="MANGLE" chainOptions={chainOptions}/>
}

export default Mangle;
