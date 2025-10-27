# 🚂 Executar SQL Diretamente no Railway

## 🎯 Método 1: Via Terminal do Railway (Mais Direto)

### 1️⃣ Localizar o Terminal

1. No Railway, clique no projeto **PostgreSQL**
2. Procure por uma aba ou botão que diga:
   - **"Terminal"**
   - **"Console"**
   - **"CLI"**
   - Ou olhe todas as abas no topo
3. Se não encontrar, tente:
   - No canto inferior direito
   - Menu com 3 pontinhos (...)
   - Ícone de terminal 🔲

### 2️⃣ Conectar ao PostgreSQL

Quando abrir o terminal, você verá algo como:

```bash
$ 
```

Digite:

```bash
psql
```

Ou se pedir senha:

```bash
psql -U postgres -d railway
```

### 3️⃣ Executar o SQL

Depois que conectar, você verá:

```bash
railway=# 
```

Agora:
1. Abra o arquivo `SQL_COPIAR_COLAR.txt`
2. **Copie TUDO** (Ctrl+A, Ctrl+C)
3. **Cole** no terminal (Ctrl+V)
4. Pressione **Enter**

### 4️⃣ Verificar

Você deve ver várias mensagens de sucesso:

```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
ALTER TABLE
ALTER TABLE
```

### 5️⃣ Sair

Digite:
```bash
\q
```

E pressione Enter.

---

## 🎯 Método 2: Via Botão Connect → psql

### 1️⃣ Usar o Modal Connect

1. No Railway, clique no botão **"Connect"**
2. Abra a aba **"Public Network"**
3. Na seção **"Raw `psql` command"**
4. Clique em **"show"** para revelar a senha
5. **Copie o comando completo**

Vai ficar assim:
```bash
PGPASSWORD=senha psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
```

### 2️⃣ Executar no Terminal do Próprio Computador

Se você tem PowerShell/CMD aberto:

1. Cole o comando que copiou
2. Pressione Enter
3. Você vai conectar ao banco

### 3️⃣ Executar o SQL

Quando conectar, você verá:

```bash
railway=# 
```

1. Abra o arquivo `SQL_COPIAR_COLAR.txt`
2. **Copie TUDO** (Ctrl+A, Ctrl+C)
3. **Cole** no terminal (Ctrl+V)
4. Pressione **Enter**

### 4️⃣ Sair

Digite:
```bash
\q
```

---

## 🎯 Método 3: Via Variables → DATABASE_URL

### 1️⃣ Copiar Connection String

1. No Railway, vá em **"Variables"**
2. Encontre **`DATABASE_URL`**
3. Clique no ícone de **copiar** 📋
4. **Guarde essa string**

### 2️⃣ Usar no Terminal Local

No PowerShell ou CMD:

```bash
# Copie a Connection URL completa
# Vai ser algo como:
# postgresql://postgres:senha@shuttle.proxy.rlwy.net:47343/railway

psql "COLE_A_URL_AQUI"
```

1. Cole a URL completa
2. Pressione Enter
3. Vai conectar!

### 3️⃣ Executar o SQL

Depois de conectar:

1. Abra o arquivo `SQL_COPIAR_COLAR.txt`
2. **Copie TUDO** (Ctrl+A, Ctrl+C)
3. **Cole** no terminal (Ctrl+V)
4. Pressione **Enter**

---

## 🔍 Se Você NÃO Tem psql Instalado

### Instalar PostgreSQL Client (Windows)

1. Baixe em: https://www.postgresql.org/download/windows/
2. Ou use Chocolatey:
   ```bash
   choco install postgresql
   ```

### Alternativa: Usar Railway CLI

1. Instale Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Conectar:
   ```bash
   railway connect Postgres
   ```

4. Executar SQL:
   - Cole o SQL do arquivo `SQL_COPIAR_COLAR.txt`
   - Pressione Enter

---

## ✅ Verificar se Funcionou

Volte no Railway:

1. Vá em **Database → Data**
2. Atualize a página (F5)
3. Você deve ver **3 tabelas**:
   - ✅ Fechamento
   - ✅ Credenciamento
   - ✅ CnpjSimulado

---

## 🎯 Qual Método Usar?

- **Método 1:** Se encontrar Terminal no Railway
- **Método 2:** Se tiver o botão Connect
- **Método 3:** Se quiser usar seu próprio terminal

**Todos funcionam! Escolha o que achar mais fácil!** 😊

---

## 🆘 Precisa de Ajuda?

- Tire uma print da tela do Railway
- Me mostre quais abas/menus você vê
- Eu te mostro exatamente onde clicar!

**Vamos fazer funcionar!** 💪

