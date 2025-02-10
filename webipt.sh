#!/bin/bash
# Script para selecionar interface de rede e salvar seu IP no arquivo .env

# Obtém a lista de interfaces usando "ip -o link show"
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

echo "Endereço IP encontrado: $ip_address"

# Cria (ou sobrescreve) o arquivo .env com a variável IP
echo "IP=$ip_address" > .env
echo "Arquivo .env criado com a linha: IP=$ip_address"
