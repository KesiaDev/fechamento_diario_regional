# 📋 Como Criar as Tabelas no Railway

## 🎯 Opção 1: Usar o Query (Mais Rápido)

### 1️⃣ Localizar o Query Tab

No Railway:
1. Clique no projeto **PostgreSQL** (card roxo)
2. Olhe no topo das abas:
   - Database → **Query** ← Clique aqui!
3. Você vai ver um editor de SQL

### 2️⃣ Executar o SQL

1. Abra o arquivo `railway-setup.sql` no seu computador
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. Cole no editor SQL do Railway
4. Clique no botão **"Run Query"** ou **"Execute"**
5. Aguarde aparecer: ✅ **"Tabelas criadas com sucesso!"**

---

## 🎯 Opção 2: Se Não Achar o Query (Método Alternativo)

### Usar o Terminal/Console do Railway

1. No Railway, clique no projeto PostgreSQL
2. Procure por **"Console"** ou **"Terminal"**
3. Ou vá em **"Settings"** → procure por terminal
4. Digite os comandos abaixo:

```bash
# Conectar ao banco
psql $DATABASE_URL

# Então cole todo o conteúdo do arquivo railway-setup.sql
```

---

## 🎯 Opção 3: Usar Ferramenta Externa

Se preferir, você pode usar:

### **Postico** (Mac) ou **pgAdmin** (Windows/Mac)

1. Baixe e instale
2. Conecte usando os dados do Railway:
   - Vá em **Variables** no Railway
   - Copie a Connection String
3. Execute o SQL do arquivo `railway-setup.sql`

---

## ✅ Como Saber se Funcionou?

Depois de executar o SQL:

1. **Volte para a aba "Data"** (onde você estava)
2. **Atualize a página** (F5)
3. Você deve ver **3 tabelas**:
   - ✅ Fechamento
   - ✅ Credenciamento  
   - ✅ CnpjSimulado

Se aparecerem as 3 tabelas, está tudo certo! ✅

---

## 🆘 Não Funcionou?

### Erro no Query?
- Verifique se copiou **TODO** o conteúdo do arquivo SQL
- Verifique se não faltou nenhuma linha

### Não Acha o Query?
- Tente procurar por "SQL Editor" ou "Query Editor"
- Ou use a Opção 2 (Terminal)

### Ainda com Problemas?
- Me avise qual erro apareceu
- Tire um print se possível

---

## 📝 Resumo Rápido

1. ✅ Abra o arquivo `railway-setup.sql`
2. ✅ Copie TUDO (Ctrl+A, Ctrl+C)
3. ✅ Vá na aba **Query** do Railway
4. ✅ Cole (Ctrl+V)
5. ✅ Clique **Run Query**
6. ✅ Verifique se as 3 tabelas apareceram

**Pronto!** 🎉

