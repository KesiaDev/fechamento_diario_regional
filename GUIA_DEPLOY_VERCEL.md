# 🚀 Guia de Deploy - Vercel

## ✅ Status Atual

- ✅ Código commitado e enviado para o GitHub
- ✅ Projeto configurado para PostgreSQL
- ✅ Pronto para deploy!

---

## 📋 Passo a Passo - Deploy na Vercel

### 1️⃣ Criar Conta no Vercel (se ainda não tiver)

1. Acesse: **https://vercel.com/signup**
2. Clique em **"Sign up"**
3. Escolha: **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios

---

### 2️⃣ Criar Banco de Dados PostgreSQL Gratuito

Você tem 3 opções GRATUITAS:

#### **Opção A: Neon (Recomendado) - 100% Grátis**
1. Acesse: **https://neon.tech**
2. Clique em **"Sign Up"** → use GitHub
3. Clique em **"Create a Project"**
4. Escolha:
   - Nome: `fechamento-diario`
   - Região: `São Paulo (Brazil)` ou mais próximo
   - PostgreSQL: 15 (última versão)
5. Clique em **"Create Project"**
6. Copie a **Connection String**:
   - Formato: `postgresql://user:password@host/dbname`
   - **GUARDE ESTA STRING!** Você vai precisar dela.

#### **Opção B: Supabase - 100% Grátis**
1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Conecte com GitHub
4. Crie um novo projeto
5. Copie a **Connection String** do banco

#### **Opção C: Railway - Conta Paga**
Você já tem Railway, então pode usar diretamente!

---

### 3️⃣ Fazer Deploy na Vercel

1. Acesse: **https://vercel.com/new**
2. Conecte com GitHub (se ainda não conectou)
3. Selecione o repositório: **`Acompanhamento_Semanal`**
4. Configuração do Projeto:
   - **Project Name:** `fechamento-diario` (ou outro nome)
   - **Framework Preset:** Next.js (já detectado automaticamente)
   - **Root Directory:** `.` (raiz)
   - **Build Command:** `npm run build` (já preenchido)
   - **Output Directory:** `.next` (já preenchido)
   - **Install Command:** `npm install` (já preenchido)

5. **VARIÁVEIS DE AMBIENTE:**
   - Clique em **"Environment Variables"**
   - Adicione:
     - **Name:** `DATABASE_URL`
     - **Value:** Cole a Connection String do PostgreSQL que você copiou
     - ☑️ Marque todas as opções (Production, Preview, Development)
   - Clique em **"Add"**

6. Clique em **"Deploy"**

7. Aguarde 2-3 minutos enquanto o Vercel faz o deploy!

---

### 4️⃣ Configurar Banco de Dados após Deploy

Após o deploy terminar:

1. Na página do projeto no Vercel, abra o **terminal** (ou use o dashboard do Neon/Supabase)
2. Execute o comando para criar as tabelas:

```bash
npx prisma db push
```

Ou se tiver acesso SSH:
```bash
npm run postinstall
npx prisma db push
```

---

### 5️⃣ Testar o Sistema

1. Após o deploy, você receberá uma URL:
   - Exemplo: `https://fechamento-diario.vercel.app`
2. Acesse a URL no navegador
3. Teste:
   - Adicionar um lançamento
   - Ver o ranking
   - Gerar relatórios

---

## 🎯 Resultado Final

Você terá:
- ✅ Sistema online em: `https://seu-projeto.vercel.app`
- ✅ Banco PostgreSQL funcionando
- ✅ Deploy automático sempre que você fizer push no GitHub
- ✅ HTTPS automático e seguro
- ✅ Domínio próprio da Vercel

---

## 🔄 Deploy Automático

**IMPORTANTE:** 
A partir de agora, SEMPRE que você fizer push no GitHub, o Vercel fará deploy automático!

```bash
# Seus comandos normais:
git add .
git commit -m "sua mensagem"
git push origin main

# O Vercel faz o deploy automaticamente!
```

---

## 📞 Precisa de Ajuda?

### Erro: "Can't connect to database"
- Verifique se a variável `DATABASE_URL` está correta
- Verifique se o banco está acessível publicamente
- Tente fazer o `npx prisma db push` novamente

### Erro no Build
- Verifique os logs no Vercel
- Certifique-se que todas as dependências estão no `package.json`

### Sistema lento
- Normal nas primeiras requisições
- As requisições seguintes serão mais rápidas (cache)

---

## 🎉 Pronto!

**Agora você tem:**
1. ✅ Sistema no ar
2. ✅ Link público para compartilhar
3. ✅ Deploy automático
4. ✅ Banco de dados funcionando

**Compartilhe o link com sua equipe e comece a usar!** 🚀

