# Script de Instalação - Fechamento Diário CIELO
# Execute no PowerShell: .\install.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fechamento Diário - CIELO" -ForegroundColor Cyan
Write-Host "  Script de Instalação" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "  Instale em: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Instalar dependências
Write-Host ""
Write-Host "Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependências instaladas" -ForegroundColor Green

# Criar .env se não existir
Write-Host ""
Write-Host "Configurando variáveis de ambiente..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    'DATABASE_URL="file:./dev.db"' | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✓ Arquivo .env criado" -ForegroundColor Green
} else {
    Write-Host "✓ Arquivo .env já existe" -ForegroundColor Green
}

# Gerar Prisma Client
Write-Host ""
Write-Host "Configurando banco de dados..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client gerado" -ForegroundColor Green

# Criar banco de dados
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao criar banco de dados" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Banco de dados criado" -ForegroundColor Green

# Finalizar
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Instalação concluída com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar o servidor, execute:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Depois acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

