#!/bin/bash
# update_meta.sh
echo "Current working directory:"
pwd  # Mostra o diretório de trabalho atual

echo "Path to the script:"
realpath update_meta.sh  # Mostra o caminho absoluto para o script

# Executa o arquivo .ts
ts-node /root/twitch-chat-dota2/update_meta.ts