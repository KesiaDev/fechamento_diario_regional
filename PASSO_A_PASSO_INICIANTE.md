# 📖 Guia Passo a Passo COMPLETO para Iniciantes

## 🎯 Objetivo
Executar o SQL no banco de dados Railway sem complicação!

---

## 📸 PASSO 1: Abrir o Railway

1. Abra o navegador
2. Vá para: **https://railway.app**
3. Faça login na sua conta
4. Você verá seu projeto PostgreSQL (card roxo)

---

## 📸 PASSO 2: Abrir o Projeto PostgreSQL

1. **Clique** no card roxo que diz **"Postgres"** (ou "PostgreSQL")
2. A tela vai mudar
3. No TOPO você verá várias abas:
   - Deployments
   - **Database** ← Clique aqui!
   - Backups
   - Variables
   - Metrics
   - Settings

Clique na aba **"Database"**

---

## 📸 PASSO 3: Procurar o Query (Primeira Tentativa)

Depois de clicar em "Database":

1. Você verá SUB-ABAS:
   - **Data** (já está aberto)
   - Extensions
   - Credentials
   - **Query** ← PROCURE ESTA ABA!

### ✅ Se você ENCONTROU a aba "Query":
- PARABÉNS! Vá para PASSO 6 ↓

### ❌ Se NÃO encontrou a aba "Query":
- Continue para PASSO 4 ↓

---

## 📸 PASSO 4: Usar o Botão Connect (Se não tem Query)

Se não encontrou a aba "Query":

1. No canto SUPERIOR DIREITO, procure um botão roxo
2. O botão deve dizer **"Connect"** ou ter um ícone de plugue ⚡
3. **Clique** neste botão
4. Vai abrir uma janela (modal)

---

## 📸 PASSO 5: Abrir as Opções do Connect

Na janela que abriu:

1. No TOPO da janela, veja 2 abas:
   - Private Network
   - **Public Network** ← Clique aqui!

2. Depois de clicar em "Public Network"

3. Vai aparecer 3 opções:
   - ✅ Connection URL
   - ✅ Raw `psql` command ← Esta é a que queremos!
   - ✅ Railway CLI `connect` command

4. Na seção **"Raw `psql` command"**:
   - Você verá um comando comprido
   - Tem um link "show" do lado ← Clique em "show"!
   - Isso vai revelar a senha

---

## 📸 PASSO 6: Copiar o Comando Completo

Depois de clicar em "show":

1. Você verá algo assim:
   ```
   PGPASSWORD=abc123 psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
   ```

2. **PASSO IMPORTANTE:**
   - Clique no ícone de **copiar** 📋 que está do lado
   - Ou **selecione tudo** e copie (Ctrl+A, Ctrl+C)

3. **Guarde esse comando!** Você vai precisar dele.

---

## 📸 PASSO 7: Abrir PowerShell no Seu Computador

No seu Windows:

1. Pressione a tecla **Windows** + **X**
2. Vai aparecer um menu
3. Clique em **"Windows PowerShell"** ou **"Terminal"**
4. Ou:
   - Pressione **Windows** + **R**
   - Digite: `powershell`
   - Pressione Enter

5. Uma tela PRETA vai abrir (essa é o terminal!)

---

## 📸 PASSO 8: Verificar se tem psql Instalado

Na tela preta (PowerShell):

1. Digite:
   ```powershell
   psql --version
   ```

2. Pressione **Enter**

### ✅ Se apareceu uma versão (ex: "psql 14.1"):
- PARABÉNS! Vá para PASSO 10 ↓

### ❌ Se apareceu "comando não encontrado":
- Vá para PASSO 9 ↓

---

## 📸 PASSO 9: Instalar psql (Se Não Tem)

Se não tem psql instalado:

### Opção A: Instalar PostgreSQL Completo

1. Abra o navegador
2. Vá para: https://www.postgresql.org/download/windows/
3. Baixe o instalador
4. Instale normalmente
5. Durante instalação, certifique-se de marcar "Command Line Tools"
6. Pressione "Next" em tudo

### Opção B: Instalar Apenas o Cliente (Mais Rápido)

1. Abra o navegador
2. Vá para: https://get.enterprisedb.com/postgresql/postgresql-15.3-1-windows-x64.exe
3. Baixe e instale

**Depois de instalar, volte para PASSO 8 para verificar!**

---

## 📸 PASSO 10: Conectar ao Banco de Dados

Agora que tem psql funcionando:

1. No PowerShell, **cole** o comando que você copiou no PASSO 6
   - (Ctrl+V)

2. Pressione **Enter**

3. Você deve ver algo assim:
   ```
   psql (15.3)
   Type "help" for help.
   
   railway=# 
   ```

**SE APARECEU "railway=# " → FUNCIONOU!** ✅

---

## 📸 PASSO 11: Executar o SQL

Agora vem a parte final:

1. Você ainda está vendo: `railway=#`

2. Abra o arquivo `SQL_COPIAR_COLAR.txt` no seu computador
   - Pode abrir no Bloco de Notas
   - Ou no VS Code

3. **Selecione TODO o conteúdo:**
   - Ctrl+A (seleciona tudo)

4. **Copie:**
   - Ctrl+C

5. **Volte para o PowerShell**

6. **Cole** no terminal:
   - Ctrl+V
   - OU: Botão direito → Colar

7. Pressione **Enter**

---

## 📸 PASSO 12: Ver as Mensagens de Sucesso

Depois de pressionar Enter, você vai ver:

```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
ALTER TABLE
ALTER TABLE
railway=#
```

**SE APARECEU ISSO → DEU CERTO!** ✅✅✅

---

## 📸 PASSO 13: Sair do psql

1. Você ainda está vendo: `railway=#`

2. Digite:
   ```
   \q
   ```

3. Pressione **Enter**

4. Você volta para o PowerShell normal

---

## 📸 PASSO 14: Verificar no Railway

1. Volte para o Railway no navegador

2. Se ainda não está no "Database → Data", clique lá

3. **ATUALIZE A PÁGINA:** Pressione F5

4. Você deve ver **3 TABELAS:**
   - ✅ Fechamento
   - ✅ Credenciamento
   - ✅ CnpjSimulado

**SE APARECERAM AS 3 TABELAS → TUDO CERTO!** 🎉🎉🎉

---

## 🆘 Problemas Comuns

### Erro: "comando não encontrado"
- Você não tem psql instalado
- Instale pelo PASSO 9

### Erro: "psql: FATAL: password authentication failed"
- Senha errada
- Vá no Railway → Connect → Mostre a senha novamente

### Erro: "psql: could not connect"
- Sem conexão com internet
- Verifique sua internet

### Não aparece nenhum resultado depois de colar SQL
- Tente pressionar Enter novamente
- Ou copiar e colar de novo

---

## ✅ Pronto!

**Agora seu banco de dados está configurado!**

**Próximos passos:**
1. ✅ Verificar deploy na Vercel
2. ✅ Acessar a URL do Vercel
3. ✅ Testar o sistema
4. ✅ Começar a usar!

**Qualquer dúvida, me avise em qual passo você está!** 😊

---

## 📞 Precisando de Ajuda?

Me diga:
1. **Em qual passo você está?**
2. **O que apareceu na tela?**
3. **Qual erro apareceu?**

**Vou te ajudar!** 💪

