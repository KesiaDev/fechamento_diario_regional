# 🚀 Guia de Deploy - Vercel + Railway

## ✅ Status Atual

- ✅ Código commitado e enviado para o GitHub
- ✅ Projeto configurado para PostgreSQL
- ✅ Você já tem conta no Railway!
- ✅ Pronto para deploy!

---

## 📋 Passo a Passo Completo

### 1️⃣ Criar/Configurar Banco PostgreSQL no Railway

1. **Acesse o Railway:**
   - Vá para: **https://railway.app**
   - Faça login com sua conta

2. **Criar novo projeto (se não tiver):**
   - Clique em **"New Project"**
   - Selecione **"Provision PostgreSQL"**
   - Ou clique em **"Empty Project"** e depois **"Add Service"** → **"PostgreSQL"**

3. **Obter Connection String:**
   - Clique no serviço PostgreSQL que você criou
   - Vá na aba **"Variables"**
   - Procure pela variável **`DATABASE_URL`**
   - Clique no ícone de copiar 📋 ao lado do valor
   - **IMPORTANTE:** Guarde esta string! Ela é assim:
     ```
     postgresql://postgres:senha@hostname:porta/railway
     ```

4. **Configurar acesso público (opcional):**
   - Vá na aba **"Settings"**
   - Em **"Public Networking"**, habilite se necessário
   - Por padrão, o Railway já permite acesso da Vercel

---

### 2️⃣ Fazer Deploy na Vercel

1. **Criar conta no Vercel (se ainda não tiver):**
   - Acesse: **https://vercel.com/signup**
   - Clique em **"Continue with GitHub"**
   - Autorize o acesso

2. **Fazer Deploy:**
   - Acesse: **https://vercel.com/new**
   - Selecione o repositório: **`fechamento_diario_regional`**
   - Aguarde o Vercel detectar as configurações

3. **Configurações do Projeto:**
   - **Project Name:** `fechamento-diario` (ou outro nome de sua escolha)
   - **Framework:** Next.js (detectado automaticamente) ✅
   - **Root Directory:** `.` (raiz)
   - **Build Command:** `npm run build` ✅
   - **Output Directory:** `.next` ✅
   - **Install Command:** `npm install` ✅

4. **⚠️ VARIÁVEIS DE AMBIENTE (MUITO IMPORTANTE!):**
   
   [!] **ANTES de clicar em "Deploy"**, você precisa adicionar a variável de ambiente:
   
   - Clique em **"Environment Variables"**
   - Adicione a seguinte variável:
     - **Key (Nome):** `DATABASE_URL`
     - **Value:** Cole a Connection String que você copiou do Railway
     - ✅ Marque TODAS as opções:
       - ☑️ Production
       - ☑️ Preview  
       - ☑️ Development
   - Clique em **"Add"**
   - Verifique se aparece na lista

5. **Fazer Deploy:**
   - Clique em **"Deploy"**
   - Aguarde 2-3 minutos
   - ⏳ O Vercel vai:
     - Instalar dependências
     - Gerar o Prisma Client
     - Fazer o build do Next.js
     - Fazer deploy

---

### 3️⃣ Configurar Banco de Dados após Deploy

Após o deploy terminar, você precisa criar as tabelas no banco:

1. **Opção A - Via Railway Dashboard (Recomendado):**
   
   - No Railway, clique no serviço PostgreSQL
   - Vá na aba **"Query"**
   - Cole este comando SQL:
   
   ```sql
   CREATE TABLE IF NOT EXISTS "Fechamento" (
     "id" TEXT NOT NULL,
     "gerenteEstadual" TEXT NOT NULL,
     "executivo" TEXT NOT NULL,
     "agencia" TEXT NOT NULL,
     "porteAgencia" TEXT,
     "gerentePJ" TEXT,
     "qtdVisitas" INTEGER NOT NULL,
     "qtdInteracoes" INTEGER NOT NULL,
     "qtdBraExpre" INTEGER NOT NULL,
     "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL,
     CONSTRAINT "Fechamento_pkey" PRIMARY KEY ("id")
   );

   CREATE TABLE IF NOT EXISTS "Credenciamento" (
     "id" TEXT NOT NULL,
     "fechamentoId" TEXT NOT NULL,
     "qtdCredenciamentos" INTEGER NOT NULL,
     "ativacoesValor" DOUBLE PRECISION NOT NULL,
     "ec" TEXT NOT NULL,
     "volumeRS" DOUBLE PRECISION NOT NULL,
     "ra" BOOLEAN NOT NULL,
     "cesta" TEXT NOT NULL,
     "instalaDireto" BOOLEAN NOT NULL,
     "nomeGerentePJ" TEXT,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP Tz,
     "updatedAt" TIMESTAMP(3) NOT NULL,
     CONSTRAINT "Credenciamento_pkey" PRIMARY KEY ("id")
   );

   CREATE TABLE IF NOT EXISTS "CnpjSimulado" (
     "id" TEXT NOT NULL,
     "fechamentoId" TEXT NOT NULL,
     "cnpj" TEXT NOT NULL,
     "nomeEmpresa" TEXT NOT NULL,
     "faturamento" DOUBLE PRECISION NOT NULL,
     "comentarios" TEXT,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL,
     CONSTRAINT "CnpjSimulado_pkey" PRIMARY KEY ("id")
   );

   CREATE INDEX IF NOT EXISTS "Credenciamento_fechamentoId_idx" ON "Credenciamento"("fechamentoId");
   CREATE INDEX IF NOT EXISTS "CnpjSimulado_fechamentoId_idx" ON "CnpjSimulado"("fechamentoId");
   ALTER TABLE "Credenciamento" ADD CONSTRAINT "Credenciamento_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
   ALTER TABLE "CnpjSimulado" ADD CONSTRAINT "CnpjSimulado_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Fechamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
   ```

   - Clique em **"Run Query"** ou **"Execute"**

2. **Opção B - Via Terminal (se tiver acesso):**
   
   ```bash
   # Instalar Prisma CLI globalmente (se não tiver)
   npm install -g prisma
   
   # Definir a URL do banco
   export DATABASE_URL="sua-connection-string-do-railway"
   
   # Aplicar schema
   npx prisma db push --force-reset
   ```

---

### 4️⃣ Testar o Sistema

1. **Acesse a URL do Vercel:**
   - Exemplo: `https://fechamento-diario.vercel.app`
   - Você recebeu esta URL após o deploy

2. **Teste as funcionalidades:**
   - ✅ Página inicial carrega?
   - ✅ Formulário de lançamento aparece?
   - ✅ Selecionar Gerente Estadual
   - ✅ Selecionar Executivo (GN)
   - ✅ Selecionar Agência
   - ✅ Adicionar credenciamento
   - ✅ Salvar fechamento
   - ✅ Ver ranking
   - ✅ Gerar relatórios

3. **Se tudo funcionar:**
   - ✅ Deploy concluído com sucesso!
   - ✅ Sistema pronto para uso!
   - ✅ Compartilhe o link com sua equipe

---

## 🎯 Resultado Final

Você terá:
- ✅ Sistema online em: `https://fechamento-diario.vercel.app` (ou seu nome)
- ✅ Banco PostgreSQL funcionando no Railway
- ✅ Deploy automático sempre que fizer push no GitHub
- ✅ HTTPS automático e seguro
- ✅ Domínio próprio da Vercel
- ✅ Sistema responsivo para celular, tablet e desktop

---

## 🔄 Deploy Automático

**Agora funciona assim:**

1. Você faz alterações no código
2. Faz commit e push:
   ```bash
   git add .
   git commit -m "sua mensagem"
   git push origin main
   ```
3. O Vercel detecta automaticamente
4. Faz deploy automático em ~2-3 minutos
5. Nova versão no ar!

---

## 📊 Monitoramento

### No Vercel:
- Veja deployments em: https://vercel.com/dashboard
- Veja logs em tempo real
- Veja erros e avisos

### No Railway:
- Veja uso do banco em: https://railway.app/dashboard
- Veja conexões ativas
- Monitore espaço usado

---

## 🆘 Solução de Problemas

### ❌ Erro: "Can't connect to database"

**Solução:**
1. Verifique se a variável `DATABASE_URL` está correta no Vercel
2. Verifique se copiou a string completa do Railway
3. Verifique se o banco está "Online" no Railway
4. Tente recriar a variável de ambiente no Vercel

### ❌ Erro: "table does not exist"

**Solução:**
1. Execute os comandos SQL na Opção A do passo 3
2. Ou tente novamente `npx prisma db push`
3. Verifique se as tabelas foram criadas no Railway

### ❌ Erro no Build do Vercel

**Solução:**
1. Veja os logs no Vercel
2. Verifique se todas as dependências estão no `package.json`
3. Limpe o cache no Vercel e refaça o deploy

### ❌ Sistema lento

**Solução:**
1. Normal na primeira execução (cold start)
2. Aguarde alguns segundos na primeira requisição
3. O sistema acelera após cache

---

## 📈 Próximos Passos

Após o sistema estar no ar:

1. **Compartilhe com a equipe:**
   - Envie o link do Vercel
   - Todos podem acessar de qualquer lugar

2. **Comece a usar:**
   - Adicione lançamentos diários
   - Acompanhe o ranking
   - Gere relatórios semanais

3. **Acompanhe o uso:**
   - Monitore no Vercel e Railway
   - Ajuste se necessário

---

## 🎉 Pronto!

**Seu sistema está online e funcionando!**

**Você tem:**
- ✅ Link público para acessar
- ✅ Banco de dados funcionando
- ✅ Deploy automático
- ✅ Sistema profissional e seguro

**Compartilhe e comece a usar!** 🚀

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema:
1. Verifique os logs no Vercel
2. Verifique o status do banco no Railway
3. Veja se as variáveis de ambiente estão corretas
4. Tente refazer o deploy

**Boa sorte com o deploy!** 💪

