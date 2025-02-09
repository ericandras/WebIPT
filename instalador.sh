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
    command -v "$1" > /dev/null 2>&1
}

echo "${YELLOW}🔍 Verificando dependências...${RESET}"

# Atualiza pacotes se Node.js ou Yarn não estiverem instalados
if ! command_exists node || ! command_exists yarn; then
    echo -n "${BLUE} Atualizando pacotes do sistema..."
    ( apt-get update -y > /dev/null 2>&1 && apt-get upgrade -y > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}"
fi

# Instala dependências do sistema (se não estiverem instaladas)
for pkg in curl gnupg iptables; do
    if ! dpkg -s "$pkg" > /dev/null 2>&1; then
        echo -n "${BLUE}Instalando $pkg..."
        ( apt-get install -y "$pkg" > /dev/null 2>&1 ) &
        loading_bar
        echo " ${GREEN}"
    else
        echo "${GREEN} $pkg já está instalado."
    fi
done

# Instala Node.js se não estiver presente
if ! command_exists node; then
    echo -n "${BLUE} Adicionando repositório do Node.js..."
    ( curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}"

    echo -n "${BLUE}Instalando Node.js..."
    ( apt-get install -y nodejs > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}"
    echo "${GREEN} Node.js instalado! Versão: $(node -v)"
else
    echo "${GREEN} Node.js já instalado. Versão: $(node -v)"
fi

# Instala o Yarn se necessário
if ! command_exists yarn; then
    echo -n "${BLUE} Configurando o repositório do Yarn...${RESET}"

    mkdir -p /usr/share/keyrings

    ( curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | tee /usr/share/keyrings/yarn-archive-keyring.gpg > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}${RESET}"

    ( echo "deb [signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}${RESET}"

    echo -n "${BLUE}Instalando Yarn..."
    ( apt-get update -y > /dev/null 2>&1 && apt-get install -y yarn > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}"
    echo "${GREEN} Yarn instalado! Versão: $(yarn -v)"
else
    echo "${GREEN} Yarn já instalado. Versão: $(yarn -v)"
fi

# Instala dependências do projeto (diretório client)
if [ -d "client" ] && [ -f "client/package.json" ]; then
    echo "${BLUE} Instalando dependências do Yarn em client/..."
    ( cd client && yarn install --silent > /dev/null 2>&1 ) &
    loading_bar
    echo " ${GREEN}"
else
    echo "${RED}Diretório 'client' não encontrado ou sem package.json. Pulando..."
fi

# Instala dependências do projeto (diretório server)
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo "${BLUE} Instalando dependências do Yarn em server/..."
    ( cd server && yarn install --silent > /dev/null 2>&1 ) &
    loading_bar
    echo "${GREEN}"
else
    echo "${RED}Diretório 'server' não encontrado ou sem package.json. Pulando..."
fi

echo "${GREEN}Instalação concluída com sucesso!${RESET}"
