#!/bin/bash

# Atualiza os pacotes do sistema
sudo apt-get update -y && sudo apt-get upgrade -y

# Instala as dependências necessárias
sudo apt-get install -y curl gnupg

# Adiciona o repositório do Node.js (LTS recomendado para estabilidade)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Instala o Node.js e o gerenciador de pacotes npm
sudo apt-get install -y nodejs

# Verifica a instalação do Node.js e npm
node -v
npm -v

# Adiciona a chave GPG e o repositório do Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# Atualiza os repositórios e instala o Yarn
sudo apt-get update -y
sudo apt-get install -y yarn

# Verifica a instalação do Yarn
yarn -v

echo "Node.js, Yarn e Express.js instalados e configurados com sucesso!"
