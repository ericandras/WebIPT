#!/bin/bash

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "🔍 Verificando dependências..."

# Atualiza pacotes apenas se necessário
if ! command_exists node || ! command_exists yarn; then
    echo "🔄 Atualizando pacotes do sistema..."
    apt-get update -y && apt-get upgrade -y
fi

# Instala dependências do sistema (se não estiverem instaladas)
for pkg in curl gnupg iptables; do
    if ! dpkg -s "$pkg" &>/dev/null; then
        echo "📦 Instalando $pkg..."
        apt-get install -y "$pkg"
    else
        echo "✅ $pkg já está instalado."
    fi
done

# Instala Node.js se não estiver presente
if ! command_exists node; then
    echo "🌍 Adicionando repositório do Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    echo "📦 Instalando Node.js..."
    apt-get install -y nodejs
    echo "✅ Node.js instalado! Versão: $(node -v)"
else
    echo "✅ Node.js já instalado. Versão: $(node -v)"
fi

# Verifica se npm está instalado (vem junto com Node.js)
if command_exists npm; then
    echo "✅ npm já instalado. Versão: $(npm -v)"
else
    echo "⚠️ npm não encontrado. Algo deu errado na instalação do Node.js."
fi

# Instala Yarn se necessário
if ! command_exists yarn; then
    echo "🌍 Adicionando repositório do Yarn..."
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
    apt-get update -y
    echo "📦 Instalando Yarn..."
    apt-get install -y yarn
    echo "✅ Yarn instalado! Versão: $(yarn -v)"
else
    echo "✅ Yarn já instalado. Versão: $(yarn -v)"
fi

# Instala dependências do projeto (se necessário)
if [ -d "client" ] && [ -f "client/package.json" ]; then
    echo "📂 Instalando dependências do Yarn em client/"
    cd client && yarn install && cd ..
else
    echo "⚠️ Diretório 'client' não encontrado ou sem package.json. Pulando..."
fi

if [ -d "server" ] && [ -f "server/package.json" ]; then
    echo "📂 Instalando dependências do Yarn em server/"
    cd server && yarn install && cd ..
else
    echo "⚠️ Diretório 'server' não encontrado ou sem package.json. Pulando..."
fi

echo "🎉 Instalação concluída com sucesso!"
