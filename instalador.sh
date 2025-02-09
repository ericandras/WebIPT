#!/bin/bash

# Cores para saída no terminal
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

# Animação de carregamento
spin() {
    local pid=$!
    local delay=0.1
    local spinstr='|/-\'
    while ps -p $pid > /dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Verifica se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "${YELLOW}🔍 Verificando dependências...${RESET}"

# Atualiza pacotes apenas se necessário
if ! command_exists node || ! command_exists yarn; then
    echo "${BLUE}🔄 Atualizando pacotes do sistema...${RESET}"
    apt-get update -y && apt-get upgrade -y & spin
fi

# Instala dependências do sistema (se não estiverem instaladas)
for pkg in curl gnupg iptables; do
    if ! dpkg -s "$pkg" &>/dev/null; then
        echo "${BLUE}📦 Instalando $pkg...${RESET}"
        apt-get install -y "$pkg" & spin
    else
        echo "${GREEN}✅ $pkg já está instalado.${RESET}"
    fi
done

# Instala Node.js se não estiver presente
if ! command_exists node; then
    echo "${BLUE}🌍 Adicionando repositório do Node.js...${RESET}"
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - & spin
    echo "${BLUE}📦 Instalando Node.js...${RESET}"
    apt-get install -y nodejs & spin
    echo "${GREEN}✅ Node.js instalado! Versão: $(node -v)${RESET}"
else
    echo "${GREEN}✅ Node.js já instalado. Versão: $(node -v)${RESET}"
fi

# Verifica se npm está instalado (vem junto com Node.js)
if command_exists npm; then
    echo "${GREEN}✅ npm já instalado. Versão: $(npm -v)${RESET}"
else
    echo "${RED}⚠️ npm não encontrado. Algo deu errado na instalação do Node.js.${RESET}"
fi

# Instala Yarn se necessário
if ! command_exists yarn; then
    echo "${BLUE}🌍 Adicionando repositório do Yarn...${RESET}"
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - & spin
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
    apt-get update -y & spin
    echo "${BLUE}📦 Instalando Yarn...${RESET}"
    apt-get install -y yarn & spin
    echo "${GREEN}✅ Yarn instalado! Versão: $(yarn -v)${RESET}"
else
    echo "${GREEN}✅ Yarn já instalado. Versão: $(yarn -v)${RESET}"
fi

# Instala dependências do projeto (se necessário)
if [ -d "client" ] && [ -f "client/package.json" ]; then
    echo "${BLUE}📂 Instalando dependências do Yarn em client/${RESET}"
    cd client && yarn install & spin && cd ..
else
    echo "${RED}⚠️ Diretório 'client' não encontrado ou sem package.json. Pulando...${RESET}"
fi

if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo "${BLUE}📂 Instalando dependências do Yarn em server/${RESET}"
    cd server && yarn install & spin && cd ..
else
    echo "${RED}⚠️ Diretório 'server' não encontrado ou sem package.json. Pulando...${RESET}"
fi

echo "${GREEN}🎉 Instalação concluída com sucesso!${RESET}"
