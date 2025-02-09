#!/bin/bash

# Cores para saída no terminal
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
RED=$(tput setaf 1)
RESET=$(tput sgr0)

# Função para exibir uma barra de carregamento
loading_bar() {
    # Captura o PID do último processo executado em background
    local pid=$!
    local delay=0.1
    local max=30       # largura da barra
    local i=0
    local bar=""
    # Enquanto o processo estiver ativo...
    while kill -0 "$pid" 2>/dev/null; do
        # Incrementa (de 0 até max) e reinicia quando atingir o máximo
        i=$(( (i + 1) % (max + 1) ))
        # Cria a barra com 'i' caracteres preenchidos com '#'
        bar=$(printf "%-${i}s" "" | tr ' ' '#')
        # Imprime a barra preenchida dentro de um campo de largura 'max'
        printf "\r[%-${max}s]" "$bar"
        sleep $delay
    done
    # Quando o processo termina, imprime a barra completa e quebra a linha
    printf "\r[%-${max}s]\n" "$(printf '%0.s#' $(seq 1 $max))"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "${YELLOW}🔍 Verificando dependências...${RESET}"

# Atualiza pacotes se Node.js ou Yarn não estiverem instalados
if ! command_exists node || ! command_exists yarn; then
    echo -n "${BLUE}🔄 Atualizando pacotes do sistema...${RESET}"
    ( apt-get update -y &>/dev/null && apt-get upgrade -y &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"
fi

# Instala dependências do sistema (se não estiverem instaladas)
for pkg in curl gnupg iptables; do
    if ! dpkg -s "$pkg" &>/dev/null; then
        echo -n "${BLUE}📦 Instalando $pkg...${RESET}"
        ( apt-get install -y "$pkg" &>/dev/null ) &
        loading_bar
        echo " ${GREEN}✅${RESET}"
    else
        echo "${GREEN}✅ $pkg já está instalado.${RESET}"
    fi
done

# Instala Node.js se não estiver presente
if ! command_exists node; then
    echo -n "${BLUE}🌍 Adicionando repositório do Node.js...${RESET}"
    ( curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"

    echo -n "${BLUE}📦 Instalando Node.js...${RESET}"
    ( apt-get install -y nodejs &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"
    echo "${GREEN}✅ Node.js instalado! Versão: $(node -v)${RESET}"
else
    echo "${GREEN}✅ Node.js já instalado. Versão: $(node -v)${RESET}"
fi

# Verifica se o npm está instalado (vem com o Node.js)
if command_exists npm; then
    echo "${GREEN}✅ npm já instalado. Versão: $(npm -v)${RESET}"
else
    echo "${RED}⚠️ npm não encontrado. Algo deu errado na instalação do Node.js.${RESET}"
fi

# Instala o Yarn se necessário
if ! command_exists yarn; then
    echo -n "${BLUE}🌍 Adicionando repositório do Yarn...${RESET}"
    ( curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"

    echo -n "${BLUE}📦 Instalando Yarn...${RESET}"
    ( apt-get update -y &>/dev/null && apt-get install -y yarn &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"
    echo "${GREEN}✅ Yarn instalado! Versão: $(yarn -v)${RESET}"
else
    echo "${GREEN}✅ Yarn já instalado. Versão: $(yarn -v)${RESET}"
fi

# Instala dependências do projeto (diretório client)
if [ -d "client" ] && [ -f "client/package.json" ]; then
    echo -n "${BLUE}📂 Instalando dependências do Yarn em client/...${RESET}"
    ( cd client && yarn install &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"
else
    echo "${RED}⚠️ Diretório 'client' não encontrado ou sem package.json. Pulando...${RESET}"
fi

# Instala dependências do projeto (diretório server)
if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo -n "${BLUE}📂 Instalando dependências do Yarn em server/...${RESET}"
    ( cd server && yarn install &>/dev/null ) &
    loading_bar
    echo " ${GREEN}✅${RESET}"
else
    echo "${RED}⚠️ Diretório 'server' não encontrado ou sem package.json. Pulando...${RESET}"
fi

echo "${GREEN}🎉 Instalação concluída com sucesso!${RESET}"
