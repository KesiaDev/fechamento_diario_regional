# 🔴 URGENTE: Executar SQL no Railway

## Erro Atual
O banco de dados está faltando as colunas `agenciaSimulacao` e `pjIndicou` na tabela `CnpjSimulado`.

## Solução: Executar SQL no Railway

### Passo 1: Acessar o Railway
1. Acesse https://railway.app
2. Faça login na sua conta
3. Selecione o projeto do banco de dados PostgreSQL

### Passo 2: Abrir o Query Editor
1. Clique no serviço do PostgreSQL
2. Vá na aba **"Query"** ou **"SQL Editor"** ou **"Data"**
3. Se não encontrar, procure por **"Query"** ou **"SQL"** no menu

### Passo 3: Executar o SQL
Cole e execute o seguinte SQL:

```sql
-- Adicionar novos campos ao modelo CnpjSimulado
ALTER TABLE "CnpjSimulado" 
ADD COLUMN IF NOT EXISTS "agenciaSimulacao" TEXT,
ADD COLUMN IF NOT EXISTS "pjIndicou" TEXT;
```

### Passo 4: Verificar se funcionou
Execute este SQL para verificar se as colunas foram criadas:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CnpjSimulado' 
AND column_name IN ('agenciaSimulacao', 'pjIndicou');
```

Deve retornar 2 linhas mostrando as colunas criadas.

### Passo 5: Testar a aplicação
Após executar o SQL, tente salvar um fechamento novamente.

## SQL Completo (Copiar e Colar)

```sql
ALTER TABLE "CnpjSimulado" 
ADD COLUMN IF NOT EXISTS "agenciaSimulacao" TEXT,
ADD COLUMN IF NOT EXISTS "pjIndicou" TEXT;
```

---

**Nota:** Se você não encontrar a aba "Query" no Railway, pode usar o Adminer ou qualquer cliente PostgreSQL conectado ao banco.

