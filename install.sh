#!/bin/bash
# Script de Instalação - Fechamento Diário CIELO
# Execute: chmod +x install.sh && ./install.sh

echo "========================================"
echo "  Fechamento Diário - CIELO"
echo "  Script de Instalação"
echo "========================================"
echo ""

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js não encontrado!"
    echo "  Instale em: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Node.js instalado: $NODE_VERSION"

# Instalar dependências
echo ""
echo "Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ Erro ao instalar dependências"
    exit 1
fi
echo "✓ Dependências instaladas"

# Criar .env se não existir
echo ""
echo "Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    echo 'DATABASE_URL="file:./dev.db"' > .env
    echo "✓ Arquivo .env criado"
else
    echo "✓ Arquivo .env já existe"
fi

# Gerar Prisma Client
echo ""
echo "Configurando banco de dados..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "✗ Erro ao gerar Prisma Client"
    exit 1
fi
echo "✓ Prisma Client gerado"

# Criar banco de dados
npx prisma db push

if [ $? -ne 0 ]; then
    echo "✗ Erro ao criar banco de dados"
    exit 1
fi
echo "✓ Banco de dados criado"

# Finalizar
echo ""
echo "========================================"
echo "  ✓ Instalação concluída com sucesso!"
echo "========================================"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  npm run dev"
echo ""
echo "Depois acesse: http://localhost:3000"
echo ""

