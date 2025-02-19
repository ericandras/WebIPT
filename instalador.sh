#!/bin/bash

# Cores para saída no terminal
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

# Função para exibir uma barra de carregamento
loading_bar() {
    local pid=$!
    local delay=0.1
    local max=30
    local i=0
    local bar=""

    while kill -0 "$pid" 2>/dev/null; do
        i=$(( (i + 1) % (max + 1) ))
        bar=$(printf "%-${i}s" "" | tr ' ' '#')
        printf "\r[%-${max}s]" "$bar"
        sleep $delay
    done
    printf "\r[%-${max}s]\n" "$(printf '%0.s#' $(seq 1 $max))"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" 
}

echo "${YELLOW}Verificando dependências...${RESET}"

# Atualiza pacotes se Node.js ou Yarn não estiverem instalados
if ! command_exists node || ! command_exists yarn; then
    echo -n "${BLUE}Atualizando pacotes do sistema..."
    ( apt-get update -y  && apt-get upgrade -y  ) &
    loading_bar
    echo "${GREEN}"
fi

# Instala dependências do sistema (se não estiverem instaladas)
for pkg in curl gnupg iptables; do
    if ! dpkg -s "$pkg" ; then
        echo -n "${BLUE}Instalando $pkg..."
        ( apt-get install -y "$pkg"  ) &
        loading_bar
        echo " ${GREEN}"
    else
        echo "${GREEN}$pkg já está instalado."
    fi
done

# Instala Node.js se não estiver presente
if ! command_exists node; then
    echo -n "${BLUE} Adicionando repositório do Node.js..."
    ( curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -  ) &
    loading_bar
    echo " ${GREEN}"

    echo -n "${BLUE}Instalando Node.js..."
    ( apt-get install -y nodejs  ) &
    loading_bar
    echo " ${GREEN}"
    echo "${GREEN}Node.js instalado! Versão: $(node -v)"
else
    echo "${GREEN}Node.js já instalado. Versão: $(node -v)"
fi

# Instala o Yarn se necessário
if ! command_exists yarn; then
    echo -n "${BLUE}Configurando o repositório do Yarn...${RESET}"

   mkdir -p /usr/share/keyrings

    # Baixa a chave GPG e salva corretamente como um keyring
    curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarn-archive-keyring.gpg > /dev/null

    # Adiciona o repositório do Yarn, garantindo que a chave seja referenciada corretamente
    echo "deb [signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list > /dev/null

    # Atualiza os pacotes e instala o Yarn
    echo -n "${BLUE}Instalando Yarn..."
    ( apt-get update -y && apt-get install -y yarn ) &
    loading_bar
    echo " ${GREEN}"
    echo "${GREEN}Yarn instalado! Versão: $(yarn -v)"
else
    echo "${GREEN}Yarn já instalado. Versão: $(yarn -v)"
fi

# Instala dependências do projeto (diretório client)
if [ -d "client" ] && [ -f "client/package.json" ]; then
    echo "${BLUE}Instalando dependências do Yarn em client/..."
    ( cd client && yarn install --silent  ) &
    loading_bar
    echo " ${GREEN}"
else
    echo "${RED}Diretório 'client' não encontrado ou sem package.json. Pulando..."
fi

# Instala dependências do projeto (diretório server)
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo "${BLUE}Instalando dependências do Yarn em server/..."
    ( cd server && yarn install --silent  ) &
    loading_bar
    echo "${GREEN}"
else
    echo "${RED}Diretório 'server' não encontrado ou sem package.json. Pulando..."
fi

echo "${GREEN}Instalação concluída com sucesso!${RESET}"

criar_servico_iptables() {
    local SERVICE_NAME="iptables-restore.service"
    local RULES_FILE="/etc/iptables/regras.txt"
    local SERVICE_PATH="/etc/systemd/system/$SERVICE_NAME"

    # Verifica se o systemd está presente
    if ! command -v systemctl &> /dev/null; then
        echo "Erro: systemd não encontrado. Este script requer um sistema com systemd."
        return 1
    fi

    # Garante que o diretório do iptables existe
    mkdir -p /etc/iptables

    # Cria um arquivo de regras padrão, se não existir
    if [ ! -f "$RULES_FILE" ]; then
        echo "Criando um arquivo de regras padrão em $RULES_FILE..."
        iptables-save | tee "$RULES_FILE" > /dev/null
    fi

    # Cria o serviço systemd
    echo "Criando o serviço systemd para restaurar as regras do iptables..."
    tee "$SERVICE_PATH" > /dev/null <<EOF
[Unit]
Description=Restaurar regras do iptables no boot
After=network.target

[Service]
Type=oneshot
ExecStart=/sbin/iptables-restore < $RULES_FILE
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

    # Recarrega o systemd, ativa e inicia o serviço
    systemctl daemon-reload
    systemctl enable "$SERVICE_NAME"
    systemctl start "$SERVICE_NAME"

    echo "✅ Serviço systemd '$SERVICE_NAME' criado e ativado com sucesso!"
}

# Chamada da função para executar a configuração
criar_servico_iptables


script_dir="$(cd "$(dirname "$0")" && pwd)"
echo "alias webipt=\"$script_dir/webipt.sh\"" >> ~/.profile
if [ -n "$BASH_VERSION" ]; then
    echo "alias webipt=\"$script_dir/webipt.sh\"" >> ~/.bashrc
    echo "Alias adicionado ao ~/.bashrc para Bash."
fi
if [ -n "$BASH_VERSION" ]; then
    . ~/.bashrc
else
    . ~/.profile
fi

echo "webipt adicionado ao PATH. chame 'webipt' para usar o comando."
