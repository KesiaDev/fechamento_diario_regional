# 🔴 URGENTE: Adicionar Colunas no Banco de Dados

## Problema
O erro "The column `agenciaSimulacao` does not exist" significa que as colunas não foram criadas no banco de dados.

## ✅ Solução: Executar SQL no Railway

### SQL para Copiar e Colar:

```sql
ALTER TABLE "CnpjSimulado" 
ADD COLUMN IF NOT EXISTS "agenciaSimulacao" TEXT,
ADD COLUMN IF NOT EXISTS "pjIndicou" TEXT;
```

### Como Executar:

#### Opção 1: Via Railway Dashboard (Mais Fácil)
1. Acesse https://railway.app e faça login
2. Selecione seu projeto PostgreSQL
3. Procure por uma aba chamada:
   - **"Query"**
   - **"SQL Editor"**
   - **"Data"** → depois **"Query"**
   - Ou **"Connect"** → depois procure por editor SQL
4. Cole o SQL acima
5. Clique em **"Run"** ou **"Execute"**

#### Opção 2: Via Terminal (Se tiver psql instalado)
1. No Railway, clique no botão **"Connect"**
2. Copie o comando `psql` que aparece
3. Execute no seu terminal local
4. Cole e execute o SQL acima

#### Opção 3: Via Adminer (Se usar Adminer)
1. Acesse o Adminer
2. Selecione o banco de dados
3. Vá em **"SQL command"**
4. Cole o SQL acima
5. Clique em **"Execute"**

### Verificar se Funcionou:

Execute este SQL para confirmar:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CnpjSimulado' 
AND column_name IN ('agenciaSimulacao', 'pjIndicou');
```

Deve retornar 2 linhas mostrando as colunas criadas.

### Depois de Executar:
1. Tente salvar o fechamento novamente
2. O erro deve desaparecer

---

**Nota:** O `IF NOT EXISTS` garante que não dará erro se as colunas já existirem.

