# 📊 Sistema de Fechamento Diário - CIELO

Sistema completo de acompanhamento de fechamento diário dos Gerentes de Negócios (GN) CIELO.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI**
- **Prisma ORM**
- **SQLite**
- **Recharts** (pronto para gráficos)

## ⚡ Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Criar banco de dados

```bash
npx prisma migrate dev --name init
```

ou apenas gere o client:

```bash
npx prisma generate
npx prisma db push
```

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📋 Funcionalidades Implementadas

### ✅ Formulário de Lançamento
- Campos do GN: Executivo, Agência, Qtd Visitas, Qtd Bra Expre
- Múltiplos credenciamentos por lançamento
- Botão "+ Adicionar Credenciamento" para criar cards dinâmicos
- Campos por credenciamento:
  - Qtd de credenciamentos
  - Volume R$
  - EC (10 dígitos numéricos)
  - Volume R$
  - RA (Sim/Não)
  - Cesta (texto)
  - PJ Instala Direto (Sim/Não)
- Validação completa de todos os campos
- Data automática

### ✅ Salvamento no Banco
- API Routes com Next.js
- Prisma ORM com SQLite
- Relação entre Fechamento e Credenciamentos

### ✅ Visualização de Registros
- Tabela completa com todos os lançamentos
- Filtros por período: Dia, Semana, Mês
- Totalizadores automáticos

### ✅ Ranking dos GNs
- Classificação por número de credenciamentos e valor ativado
- Meta diária: 2 credenciamentos (ajustável por período)
- Destaque visual para:
  - 🥇 Top 3 GNs (medalhas ouro, prata, bronze)
  - ✅ Quem bateu a meta
  - ❌ Quem ficou zerado
  - ⚠️ Quem está abaixo da meta
- Filtros: Dia, Semana, Mês

## 🎨 Design

- Interface limpa e moderna
- Responsivo (mobile-first)
- Gradiente de fundo azul
- Cards bem organizados
- Ícones e emojis para melhor UX

## 📊 Próximos Passos

- [ ] Adicionar gráficos com Recharts (barras, linhas)
- [ ] Exportação para Excel/PDF
- [ ] Gráfico de evolução por período
- [ ] Dashboard com KPIs gerais
- [ ] Autenticação de usuários
- [ ] Migração para PostgreSQL (produção)

## 📁 Estrutura do Projeto

```
fechamento-diario/
├── app/
│   ├── api/
│   │   └── fechamentos/
│   │       ├── route.ts          # Criar e listar fechamentos
│   │       └── ranking/
│   │           └── route.ts       # Ranking dos GNs
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Página principal
├── components/
│   └── ui/                        # Componentes ShadCN
├── lib/
│   ├── prisma.ts                  # Client Prisma
│   └── utils.ts                   # Funções auxiliares
├── prisma/
│   └── schema.prisma              # Schema do banco
└── package.json
```

## 🗄️ Modelo de Dados

### Fechamento
- id, executivo, agencia, qtdVisitas, qtdBraExpre, data
- Relação 1:N com Credenciamentos

### Credenciamento
- id, qtdCredenciamentos, ativacoesValor, ec, volumeRS, ra, cesta, pjInstalaDireto
- Relação N:1 com Fechamento

## 💡 Dicas de Uso

1. **Lançamento diário**: Use a aba "📝 Lançamento"
2. **Adicionar múltiplos credenciamentos**: Clique em "+ Adicionar Credenciamento"
3. **Visualizar ranking**: Use a aba "📊 Ranking"
4. **Filtrar por período**: Selecione Dia, Semana ou Mês nos filtros
5. **Meta padrão**: 2 credenciamentos por dia (10/semana, 40/mês)

## 🐛 Troubleshooting

**Erro no banco de dados?**
```bash
npx prisma generate
npx prisma db push
```

**Erro de dependências?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Licença

Projeto interno CIELO - Todos os direitos reservados.

