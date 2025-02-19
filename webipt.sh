#!/bin/bash
# Script para selecionar interface de rede e salvar seu IP no arquivo .env

# Obtém a lista de interfaces usando "ip -o link show"
reconfigure() {
    interfaces=( $(ip -o link show | awk -F': ' '{print $2}') )

    # Exibe as interfaces encontradas, numerando-as
    echo "Interfaces de rede encontradas:"
    for i in "${!interfaces[@]}"; do
        echo "  [$i] ${interfaces[$i]}"
    done

    # Define a primeira interface como padrão (índice 0)
    default_index=0
    default_interface=${interfaces[$default_index]}

    # Solicita ao usuário a escolha da interface, mostrando o padrão
    read -p "Digite o número da interface que deseja usar [${default_index}]: " escolha
    if [ -z "$escolha" ]; then
        escolha=$default_index
    fi

    # Valida se a entrada é um número e se está dentro do intervalo
    if ! [[ $escolha =~ ^[0-9]+$ ]] || [ $escolha -ge ${#interfaces[@]} ]; then
        echo "Opção inválida. Usando a interface padrão: ${default_interface}"
        interface_escolhida=$default_interface
    else
        interface_escolhida=${interfaces[$escolha]}
    fi

    echo "Interface selecionada: $interface_escolhida"

    # Obtém o endereço IPv4 da interface selecionada
    ip_address=$(ip -o -f inet addr show "$interface_escolhida" | awk '{print $4}' | cut -d/ -f1)

    # Verifica se foi encontrado um IP
    if [ -z "$ip_address" ]; then
        echo "Nenhum endereço IP encontrado para a interface $interface_escolhida."
        exit 1
    fi

    # Cria (ou sobrescreve) o arquivo .env com a variável IP

    read -p "Escreva o ip permitido para acessar o serviço: " allowed_ip

    script_dir="$(cd "$(dirname "$0")" && pwd)"
    (
        echo "INTERFACE=$interface_escolhida"
        echo "IP=$ip_address"
        echo "DEV=false"
        echo "ALLOWED_IP=$allowed_ip"
    ) > "$script_dir/server/.env"

    (
        echo "INTERFACE=$interface_escolhida"
        echo "VITE_IP=$ip_address"
        echo "VITE_IP_SERVER=$ip_address"
    ) > "$script_dir/client/.env"

    echo "IP do processo definido como $ip_address"
    
}

read_env_value() {
    file="$1"
    key="$2"
    grep "^$key=" "$file" | head -n1 | cut -d'=' -f2-
}

verify_env_files() {
    script_dir="$(cd "$(dirname "$0")" && pwd)"
    server_env="$script_dir/server/.env"
    client_env="$script_dir/client/.env"

    # Se um dos arquivos não existir, chama reconfigure
    if [ ! -f "$server_env" ] || [ ! -f "$client_env" ]; then
        echo "Um ou ambos os arquivos .env não existem. Executando reconfigure..."
        reconfigure
        return
    fi

    # Lê as variáveis do arquivo server/.env
    server_interface=$(read_env_value "$server_env" "INTERFACE")
    server_ip=$(read_env_value "$server_env" "IP")

    if [ -z "$server_interface" ] || [ -z "$server_ip" ]; then
        echo "Arquivo $server_env incompleto (faltam INTERFACE ou IP). Executando reconfigure..."
        reconfigure
        return
    fi

    # Lê as variáveis do arquivo client/.env (opcional, mas vamos verificar também)
    client_interface=$(read_env_value "$client_env" "INTERFACE")
    client_ip=$(read_env_value "$client_env" "VITE_IP")
    client_ip_server=$(read_env_value "$client_env" "VITE_IP_SERVER")

    if [ -z "$client_interface" ] || [ -z "$client_ip" ] || [ -z "$client_ip_server" ]; then
        echo "Arquivo $client_env incompleto. Executando reconfigure..."
        reconfigure
        return
    fi

    # Obtém o IP atual da interface definida em server/.env
    current_ip=$(ip -o -f inet addr show "$server_interface" | awk '{print $4}' | cut -d/ -f1)
    if [ -z "$current_ip" ]; then
        echo "Nenhum IP encontrado para a interface $server_interface."
        reconfigure
    fi

    # Se o IP definido não for igual ao IP atual, atualiza os arquivos .env
    if [ "$current_ip" != "$server_ip" ]; then
        echo "Discrepância de IP detectada: arquivo .env tem IP=$server_ip, mas o IP atual é $current_ip."
        echo "Atualizando os arquivos .env..."
        {
            echo "INTERFACE=$server_interface"
            echo "IP=$current_ip"
            echo "DEV=false"
        } > "$server_env"
        {
            echo "INTERFACE=$client_interface"
            echo "VITE_IP=$current_ip"
            echo "VITE_IP_SERVER=$current_ip"
        } > "$client_env"
        echo "Arquivos .env atualizados com o novo IP: $current_ip"
    fi
}

start_server_loop() {
    script_dir="$(cd "$(dirname "$0")" && pwd)"
    echo "ok $script_dir"
    cd $script_dir/server || exit 1
    while true; do
        yarn start> /dev/null 2>&1  &
        yarn_pid=$!
        echo "server: $yarn_pid" >> $script_dir/.yarn_pids.pid
        wait "$yarn_pid"
        ret=$?
        
        if [ $ret -eq 0 ]; then
            break
        else
            echo "Problema detectado no yarn start, reiniciando em 2 segundos..."
            sleep 2
        fi
    done
    cd ..
}

start() {
    sleep 0.2
    script_dir="$(cd "$(dirname "$0")" && pwd)"
    cd $script_dir
    export -f start_server_loop
    nohup bash -c "start_server_loop"> /dev/null 2>&1 &
    server_pid=$!
    cd $script_dir/client
    nohup yarn dev> /dev/null 2>&1 &
    client_pid=$!
    cd ..
    echo "server_wrapper: $server_pid" > $script_dir/.yarn_pids.pid
    echo "client: $client_pid" >> $script_dir/.yarn_pids.pid

    ip=$(read_env_value "$(cd "$(dirname "$0")" && pwd)/client/.env" "VITE_IP")
    allowed_ip=$(read_env_value "$(cd "$(dirname "$0")" && pwd)/server/.env" "ALLOWED_IP")

    echo "Processo iniciado! Acesse em: http://$ip:4000 na maquina de ip:$allowed_ip"
    exit 0
}

stop() {
    script_dir="$(cd "$(dirname "$0")" && pwd)"
    PID_FILE="$script_dir/.yarn_pids.pid"

    # Se o arquivo de PIDs não existe, sai imediatamente
    if [ ! -f "$PID_FILE" ]; then
        echo "Nenhum processo encontrado para interromper."
        return 0
    fi

    echo "Parando processos listados em $PID_FILE..."

    # Variável para indicar se pelo menos um processo foi encerrado
    processos_finalizados=false

    while IFS= read -r line; do
        process=$(echo "$line" | cut -d: -f1)
        pid=$(echo "$line" | cut -d: -f2 | tr -d ' ')

        # Verifica se o processo ainda existe antes de tentar matá-lo
        if ps -p "$pid" > /dev/null 2>&1; then
            processos_finalizados=true
            echo "Interrompendo '$process' (PID: $pid)..."

            # Mata os processos filhos primeiro
            pkill -P "$pid" 2>/dev/null && echo "Filhos de '$process' encerrados."

            # Mata o processo pai com SIGTERM (modo seguro)
            kill "$pid" 2>/dev/null && echo "Processo '$process' encerrado."

            # Verifica se o processo ainda está rodando e força encerramento com SIGKILL
            sleep 0.2
            if ps -p "$pid" > /dev/null 2>&1; then
                echo "Processo '$process' (PID: $pid) ainda está rodando. Forçando encerramento..."
                kill -9 "$pid" 2>/dev/null && echo "Processo '$process' encerrado à força."
            fi
        else
            echo "Processo '$process' (PID: $pid) já não está rodando."
        fi
    done < "$PID_FILE"

    # Aguarda um pouco para garantir que os processos foram finalizados
    sleep 0.5

    # Remove o arquivo de PIDs APENAS se algum processo foi finalizado
    if [ "$processos_finalizados" = true ] || [ -f "$PID_FILE" ]; then
        rm -f "$PID_FILE"
        echo "Arquivo de PIDs removido: $PID_FILE"
    fi
}





show_help() {
    echo "Uso: webipt [--help] [start] [stop] [--reconfigure]"
    echo ""
    echo ""
    echo ""
    echo "Comandos disponíveis:"
    echo "  start           - inicia ou reinicia os processos se necessario chama --reconfigure"
    echo "  stop            - Interrompe os processos."
    echo "  --reconfigure   - Interrompe os processos e solicita uma nova configuração de rede."
    echo "  --help, -h      - Exibe esta mensagem de ajuda."
    echo ""
    echo "Se nenhum parâmetro for passado, o comportamento padrão será equivalente a 'start'."
    exit 0
}

# Verifica se foi passado pelo menos um parâmetro
if [ "$#" -eq 0 ]; then
    verify_env_files
    stop
    start
    exit 0
fi

case "$1" in
    start)
        verify_env_files
        stop
        start
        ;;
    stop)
        stop
        ;;
    --reconfigure)
        reconfigure
        ;;
     --help)
        show_help
        ;;
     -h)
        show_help
        ;;
    *)
        echo "webipt: '$1' is not a webipt command. See 'webipt --help'"
        exit 1
        ;;
esac