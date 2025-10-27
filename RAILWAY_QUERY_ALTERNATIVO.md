# 🔍 Como Executar SQL no Railway (Sem Aba Query)

## 🎯 Se você NÃO encontrar a aba "Query"

### Método 1: Usar o Botão "Connect"

1. **Clique no botão "Connect"** (roxo, no canto superior direito)
2. Escolha a opção: **"psql"** ou **"Postgres CLI"**
3. Você verá um terminal aberto
4. Cole o SQL do arquivo `railway-setup.sql`

---

### Método 2: Via Variables → DATABASE_URL

1. No Railway, vá na aba **"Variables"**
2. Copie o valor de **`DATABASE_URL`**
3. Use uma ferramenta externa (postgres: [pgAdmin](https://www.pgadmin.org/), DBeaver, ou [adminer](https://www.adminer.org/))
4. Conecte usando essa URL
5. Execute o SQL

---

### Método 3: Usar psql Localmente

Se você tem psql instalado no seu computador:

```bash
# Conecte ao banco
psql "URL_AQUI"

# Cole o SQL
```

---

## 🎯 Método Mais Simples: Via Interface Web

### Usar pgAdmin ou DBeaver (Interface Gráfica)

1. **Baixe pgAdmin**: https://www.pgadmin.org/download/
2. **Instale e abra**
3. **Adicione novo servidor:**
   - Nome: `Railway PostgreSQL`
   - Host: (do DATABASE_URL do Railway)
   - Port: (do DATABASE_URL)
   - Database: (do DATABASE_URL)
   - Username: (do DATABASE_URL)
   - Password: (do DATABASE_URL)
4. **Clique em "Tools" → "Query Tool"**
5. **Cole o SQL** do arquivo `railway-setup.sql`
6. **Execute!**

---

## ⚡ Método RÁPIDO (Recomendado)

### Usar Adminer (Online, sem instalar)

1. Acesse: **https://www.adminer.org/**
2. Vá em: **https://adminer.cs50.net/** (ou qualquer adminer online)
3. Preencha:
   - **System:** PostgreSQL
   - **Server:** (host do DATABASE_URL)
   - **Username:** (username do DATABASE_URL)
   - **Password:** (password do DATABASE_URL)
   - **Database:** (database do DATABASE_URL)
4. Clique em **"Login"**
5. Clique em **"SQL command"** no menu
6. Cole o SQL do `railway-setup.sql`
7. Clique em **"Execute"**

---

## ✅ Verificar se Funcionou

Volte no Railway → Database → Data

Você deve ver **3 tabelas**:
- ✅ Fechamento
- ✅ Credenciamento
- ✅ CnpjSimulado

---

## 🎯 Qual Método Usar?

- **Mais fácil:** Adminer (método rápido)
- **Mais profissional:** pgAdmin (bom para longo prazo)
- **Mais rápido:** Se encontrar "Query" no Railway

**Escolha qualquer um!** Todos funcionam! 😊

