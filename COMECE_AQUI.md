# 🎯 COMECE AQUI!

## ✅ Checklist de Instalação

Siga estes passos na ordem:

### 1. Verificar Node.js
```bash
node --version
```
✅ Deve mostrar versão 18 ou superior  
❌ Se não tiver, instale em: https://nodejs.org

---

### 2. Instalar Dependências
```bash
npm install
```
⏳ Aguarde alguns minutos...  
✅ Deve completar sem erros

---

### 3. Criar Arquivo .env

**Windows (PowerShell):**
```powershell
echo 'DATABASE_URL="file:./dev.db"' | Out-File -FilePath .env -Encoding UTF8
```

**macOS/Linux:**
```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
```

**Ou manualmente:**
- Crie um arquivo chamado `.env` na raiz do projeto
- Adicione esta linha: `DATABASE_URL="file:./dev.db"`

✅ Arquivo .env criado

---

### 4. Configurar Banco de Dados
```bash
npx prisma generate
```
✅ Prisma Client gerado

```bash
npx prisma db push
```
✅ Banco de dados criado em `prisma/dev.db`

---

### 5. (Opcional) Popular com Dados de Teste
```bash
npm install -D tsx
npm run seed
```
✅ Banco populado com ~200 registros de teste

---

### 6. Iniciar Servidor
```bash
npm run dev
```
✅ Servidor rodando!

---

### 7. Acessar no Navegador
```
http://localhost:3000
```
✅ Sistema funcionando!

---

## 🚀 Atalho Rápido (Tudo em uma linha)

**Já tem Node.js instalado?** Execute:

```bash
npm install && npx prisma generate && npx prisma db push && npm run dev
```

Depois acesse: http://localhost:3000

---

## 🎮 Primeiro Teste

### Teste Manual (5 minutos)

1. Acesse http://localhost:3000
2. Preencha o formulário de lançamento
3. Clique em "Salvar Fechamento"
4. Veja o resultado na tabela abaixo
5. Clique na aba "📊 Ranking"

### Teste Automático (Com dados prontos)

```bash
npm install -D tsx
npm run seed
```

Depois:
1. Acesse http://localhost:3000
2. Clique na aba "📊 Ranking"
3. Veja o ranking com vários GNs
4. Mude o filtro para "Esta Semana" ou "Este Mês"

---

## 📊 Status da Instalação

Marque o que você já fez:

- [ ] Node.js instalado (v18+)
- [ ] `npm install` executado
- [ ] Arquivo `.env` criado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] `npm run dev` executado
- [ ] Acessei http://localhost:3000
- [ ] Fiz um lançamento de teste
- [ ] Vi o ranking funcionando
- [ ] (Opcional) Executei o seed

---

## 🎨 O Que Você Verá

### Tela Inicial
```
╔═══════════════════════════════════════════════════╗
║     Fechamento Diário - CIELO                     ║
║     Sistema de acompanhamento dos Gerentes        ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  [📝 Lançamento] [📊 Ranking]                     ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │  Novo Lançamento                            │ ║
║  │  Registre o fechamento do dia               │ ║
║  ├─────────────────────────────────────────────┤ ║
║  │  Executivo (GN): [________________]         │ ║
║  │  Agência Visitada: [________________]       │ ║
║  │  Qtd Visitas: [___] Bra Expre: [___]        │ ║
║  │                                             │ ║
║  │  ┌── Credenciamento #1 ──────────────────┐ │ ║
║  │  │ Qtd: [__] Volume R$: [_______]     │ │ ║
║  │  │ EC: [__________] Volume: [_______]    │ │ ║
║  │  │ RA: [▼] Cesta: [________________]     │ │ ║
║  │  │ PJ Instala: [▼]                       │ │ ║
║  │  └────────────────────────────────────────┘ │ ║
║  │                                             │ ║
║  │  [+ Adicionar Credenciamento]               │ ║
║  │                                             │ ║
║  │  [        💾 Salvar Fechamento        ]     │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │  Registros                [Hoje ▼]          │ ║
║  ├─────────────────────────────────────────────┤ ║
║  │  Tabela com lançamentos do dia...           │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## 🔧 Comandos Importantes

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor
npm run build        # Build para produção
npm start            # Rodar versão de produção
```

### Banco de Dados
```bash
npm run seed         # Popular com dados de teste
npm run db:reset     # Resetar tudo e popular
npm run db:studio    # Abrir interface visual do banco
```

### Utilitários
```bash
npm run lint         # Verificar código
npx prisma generate  # Regenerar Prisma Client
npx prisma db push   # Atualizar schema no banco
```

---

## ❌ Algo Deu Errado?

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database not found"
```bash
# Recriar banco
npx prisma generate
npx prisma db push
```

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
# Anote o PID e execute:
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

---

## 📚 Próximos Passos

### Depois que estiver funcionando:

1. **Ler a documentação completa:** `README.md`
2. **Ver exemplos de teste:** `EXEMPLOS_TESTE.md`
3. **Entender a arquitetura:** `ARQUITETURA.md`
4. **Planejar próximas features:** `ROADMAP.md`

---

## 🎯 Objetivos Desta Sessão

- [ ] Sistema instalado e funcionando
- [ ] Primeiro lançamento realizado
- [ ] Ranking visualizado
- [ ] Entendimento básico do sistema

---

## 💡 Dicas

1. **Use dados reais**: Adapte para sua operação
2. **Teste com vários GNs**: Para ver o ranking funcionando
3. **Experimente os filtros**: Dia, Semana, Mês
4. **Explore o código**: Está bem organizado e comentado
5. **Faça o seed**: Para ter dados de exemplo

---

## 🆘 Precisa de Ajuda?

| Problema | Solução |
|----------|---------|
| Instalação | `SETUP.md` |
| Uso básico | `INICIO_RAPIDO.md` |
| Testes | `EXEMPLOS_TESTE.md` |
| Técnico | `ARQUITETURA.md` |
| Futuro | `ROADMAP.md` |

---

## ✨ Tudo Pronto?

### Se você completou todos os passos:

✅ Sistema instalado  
✅ Servidor rodando  
✅ Banco de dados criado  
✅ Primeiro teste realizado  

### **Parabéns! 🎉**

Você está pronto para usar o sistema de Fechamento Diário CIELO!

---

<div align="center">

**Próximo passo:** Acesse http://localhost:3000 e comece a usar!

🚀 **Bom trabalho!** 🚀

</div>

