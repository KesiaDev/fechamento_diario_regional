# Script para configurar ambiente local (SQLite)
# Execute este script para desenvolvimento local

Write-Host "🔧 Configurando ambiente local..." -ForegroundColor Green

# Copiar schema SQLite para schema principal
Copy-Item "prisma/schema.sqlite.prisma" "prisma/schema.prisma" -Force

# Gerar cliente Prisma
Write-Host "📦 Gerando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Aplicar migrações
Write-Host "🗄️ Aplicando migrações..." -ForegroundColor Yellow
npx prisma db push

# Inserir dados de teste
Write-Host "🌱 Inserindo dados de teste..." -ForegroundColor Yellow
npx tsx seed-nomes-reais.ts

Write-Host "✅ Ambiente local configurado!" -ForegroundColor Green
Write-Host "🚀 Execute 'npm run dev' para iniciar o servidor" -ForegroundColor Cyan
