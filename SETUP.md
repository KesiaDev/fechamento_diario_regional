# 🚀 Guia Rápido de Instalação

## Passo a Passo

### 1️⃣ Instalar Node.js
Certifique-se de ter o Node.js 18+ instalado:
```bash
node --version
```

### 2️⃣ Instalar Dependências
```bash
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

Ou crie manualmente com o conteúdo:
```
DATABASE_URL="file:./dev.db"
```

### 4️⃣ Configurar Banco de Dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar o banco de dados
npx prisma db push
```

### 5️⃣ Rodar o Projeto

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] `npm install` executado com sucesso
- [ ] Arquivo `.env` criado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] Servidor rodando em localhost:3000

---

## 🎯 Primeiro Uso

1. Acesse http://localhost:3000
2. Vá na aba **"📝 Lançamento"**
3. Preencha o formulário:
   - Nome do Executivo (GN)
   - Agência visitada
   - Quantidade de visitas
   - Quantidade Bra Expre
4. Preencha os dados do credenciamento
5. Clique em **"Salvar Fechamento"**
6. Vá na aba **"📊 Ranking"** para ver o ranking

---

## ⚠️ Problemas Comuns

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Database not found"
```bash
npx prisma db push
```

### Porta 3000 já está em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🔄 Resetar Banco de Dados

Para limpar todos os dados:

```bash
# Deletar o banco
rm prisma/dev.db

# Recriar
npx prisma db push
```

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Versão do Node.js (deve ser 18+)
2. Todas as dependências instaladas
3. Arquivo `.env` existe e está correto
4. Prisma Client foi gerado

---

**Desenvolvido para CIELO** 🚀

