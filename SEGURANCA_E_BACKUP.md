# 🔒 Segurança e Backup dos Dados

Este documento descreve as medidas de segurança implementadas para proteger os dados do sistema e como realizar backups.

## 📋 Camadas de Segurança Implementadas

### 1. **Transações de Banco de Dados**
- Todas as operações de criação e atualização são realizadas em **transações**
- Garante que **tudo ou nada** seja salvo (atomicidade)
- Se houver erro durante o salvamento, nenhuma alteração parcial será mantida
- Previne corrupção de dados

### 2. **Validação de Dados**
- Validação rigorosa antes de salvar
- Campos obrigatórios são verificados
- Dados inválidos são rejeitados antes de chegar ao banco

### 3. **Exportação de Backup**
- API disponível para exportar todos os dados em formato JSON
- Inclui metadados sobre a exportação
- Permite backup manual a qualquer momento

### 4. **Importação de Backup**
- Sistema de importação para restaurar dados
- Verifica duplicatas antes de importar
- Relatório detalhado do processo de importação

## 🔄 Como Fazer Backup dos Dados

### Opção 1: Backup Manual via API

1. **Exportar dados:**
   ```bash
   # Acesse no navegador ou use curl:
   https://seu-app.vercel.app/api/backup/export
   ```
   
   Ou use o botão de exportação na interface (se implementado)

2. **Salvar o arquivo JSON** em local seguro (OneDrive, Google Drive, etc.)

3. **Fazer backup regularmente:**
   - Recomendado: **1x por dia** ao final do expediente
   - Mínimo: **1x por semana**

### Opção 2: Backup Automático no Railway (Recomendado)

O Railway oferece backups automáticos do banco PostgreSQL:

1. **Acesse o painel do Railway**
2. **Vá em sua base de dados PostgreSQL**
3. **Configurações → Backups**
4. **Ative backups automáticos diários**
5. Os backups ficam disponíveis por 30 dias

### Opção 3: Script de Backup Automatizado

Você pode criar um script que faz backup diariamente:

```javascript
// scripts/backup-diario.js
const https = require('https');
const fs = require('fs');

const url = 'https://seu-app.vercel.app/api/backup/export';
const timestamp = new Date().toISOString().split('T')[0];
const filename = `backup-${timestamp}.json`;

https.get(url, (res) => {
  const file = fs.createWriteStream(filename);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`✅ Backup salvo: ${filename}`);
  });
});
```

## 🔧 Como Restaurar Dados

### Restaurar via API

1. **Faça o backup antes de restaurar** (caso algo dê errado)

2. **Prepare o arquivo JSON** do backup

3. **Faça POST para a API de importação:**
   ```bash
   curl -X POST https://seu-app.vercel.app/api/backup/import \
     -H "Content-Type: application/json" \
     -d @backup-fechamentos-2025-01-15.json
   ```

4. **Verifique o resultado:**
   - A API retorna quantos registros foram importados
   - Mostra erros se houver duplicatas ou problemas

## 🛡️ Medidas de Segurança Adicionais

### No Railway (PostgreSQL)

1. **Ativar backups automáticos** (recomendado)
2. **Configurar retenção de backups** (30 dias mínimo)
3. **Guardar senha do banco em local seguro**
4. **Habilitar SSL/TLS** (já ativo por padrão)

### No Vercel (Aplicação)

1. **Variáveis de ambiente protegidas**
2. **HTTPS obrigatório** (já ativo)
3. **Rate limiting** (proteção contra ataques)
4. **Logs de erro** monitorados

## 📊 Monitoramento

### Verificar Integridade dos Dados

```sql
-- Contar total de fechamentos
SELECT COUNT(*) FROM "Fechamento";

-- Verificar fechamentos recentes
SELECT 
  executivo, 
  COUNT(*) as total,
  MAX("createdAt") as ultima_insercao
FROM "Fechamento"
GROUP BY executivo
ORDER BY ultima_insercao DESC;

-- Verificar registros sem credenciamentos e sem CNPJs
SELECT COUNT(*) 
FROM "Fechamento" 
WHERE NOT EXISTS (
  SELECT 1 FROM "Credenciamento" WHERE "Credenciamento"."fechamentoId" = "Fechamento".id
) 
AND NOT EXISTS (
  SELECT 1 FROM "CnpjSimulado" WHERE "CnpjSimulado"."fechamentoId" = "Fechamento".id
);
```

## ⚠️ Prevenção de Perda de Dados

### Boas Práticas:

1. ✅ **Faça backup diário** dos dados
2. ✅ **Teste a restauração** periodicamente
3. ✅ **Mantenha múltiplas cópias** do backup em locais diferentes
4. ✅ **Documente mudanças** importantes
5. ✅ **Monitore os logs** de erro do sistema

### Em Caso de Problema:

1. **Não entre em pânico** - os dados estão seguros no PostgreSQL
2. **Verifique os logs** no Railway e Vercel
3. **Use o backup mais recente** para restaurar se necessário
4. **Entre em contato** com suporte técnico se necessário

## 📞 Contato

Para dúvidas sobre backup e segurança, consulte a documentação do Railway e Vercel.

---

**Última atualização:** Janeiro 2025

