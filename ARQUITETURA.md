# 🏗️ Arquitetura do Sistema

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     FECHAMENTO DIÁRIO CIELO                 │
│                    Sistema de Acompanhamento                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Next.js 14 (App Router)         │
        │         TypeScript + React 18           │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                          ┌───────────────┐
│   Frontend    │                          │   Backend     │
│  (Client UI)  │                          │  (API Routes) │
└───────────────┘                          └───────────────┘
        │                                           │
        │                                           ▼
        │                                  ┌─────────────────┐
        │                                  │  Prisma ORM     │
        │                                  └─────────────────┘
        │                                           │
        │                                           ▼
        │                                  ┌─────────────────┐
        └─────────────────────────────────▶│  SQLite DB      │
                                           └─────────────────┘
```

---

## 📂 Estrutura de Arquivos

```
Fechamento_Diario/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes (Backend)
│   │   └── 📁 fechamentos/
│   │       ├── route.ts             # POST/GET fechamentos
│   │       └── 📁 ranking/
│   │           └── route.ts         # GET ranking
│   │
│   ├── globals.css                  # Estilos globais + Tailwind
│   ├── layout.tsx                   # Layout raiz da aplicação
│   └── page.tsx                     # Página principal (Home)
│
├── 📁 components/                   # Componentes reutilizáveis
│   └── 📁 ui/                       # Componentes ShadCN UI
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── tabs.tsx
│
├── 📁 lib/                          # Utilitários
│   ├── prisma.ts                    # Singleton Prisma Client
│   └── utils.ts                     # Helpers (formatação, etc)
│
├── 📁 prisma/                       # Configuração do banco
│   ├── schema.prisma                # Schema do banco de dados
│   └── dev.db                       # Banco SQLite (gerado)
│
├── 📄 package.json                  # Dependências do projeto
├── 📄 tsconfig.json                 # Configuração TypeScript
├── 📄 tailwind.config.ts            # Configuração Tailwind
├── 📄 next.config.mjs               # Configuração Next.js
├── 📄 postcss.config.mjs            # Configuração PostCSS
│
├── 📄 README.md                     # Documentação principal
├── 📄 INICIO_RAPIDO.md              # Guia rápido de início
├── 📄 SETUP.md                      # Guia detalhado de setup
├── 📄 ROADMAP.md                    # Próximas funcionalidades
├── 📄 ARQUITETURA.md                # Este arquivo
│
└── 📄 install.ps1 / install.sh      # Scripts de instalação
```

---

## 🗄️ Modelo de Dados

### Entidades Principais

```sql
┌─────────────────────────────────────────────┐
│              FECHAMENTO                     │
├─────────────────────────────────────────────┤
│ id              : String (PK)               │
│ executivo       : String                    │
│ agencia         : String                    │
│ qtdVisitas      : Integer                   │
│ qtdBraExpre     : Integer                   │
│ data            : DateTime                  │
│ createdAt       : DateTime                  │
│ updatedAt       : DateTime                  │
└─────────────────────────────────────────────┘
                    │
                    │ 1:N
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           CREDENCIAMENTO                    │
├─────────────────────────────────────────────┤
│ id                 : String (PK)            │
│ fechamentoId       : String (FK)            │
│ qtdCredenciamentos : Integer                │
│ ativacoesValor     : Float                  │
│ ec                 : String (10 dígitos)    │
│ volumeRS           : Float                  │
│ ra                 : Boolean                │
│ cesta              : String                 │
│ pjInstalaDireto    : Boolean                │
│ createdAt          : DateTime               │
│ updatedAt          : DateTime               │
└─────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Lançamento de Fechamento

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ User    │─────▶│ Form     │─────▶│ API     │─────▶│ Prisma   │
│ Input   │      │ (page.tsx)     │ (route.ts)    │ (DB)     │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
                      │
                      │ Validação
                      │ - Campos obrigatórios
                      │ - EC: 10 dígitos
                      │ - Valores numéricos
                      │
                      ▼
               [POST /api/fechamentos]
                      │
                      │ Cria:
                      │ 1 Fechamento
                      │ N Credenciamentos
                      │
                      ▼
                 ✅ Sucesso
```

### 2. Visualização de Dados

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ User    │─────▶│ Tabs     │─────▶│ API     │─────▶│ Prisma   │
│ Filtro  │      │ (page.tsx)     │ (route.ts)    │ (Query)  │
└─────────┘      └──────────┘      └─────────┘      └──────────┘
                                           │
                                           │
                      ┌────────────────────┴────────────────────┐
                      │                                         │
                      ▼                                         ▼
          [GET /api/fechamentos]              [GET /api/fechamentos/ranking]
                      │                                         │
                      │ Filtros:                                │ Agregação:
                      │ - Dia                                   │ - Total por GN
                      │ - Semana                                │ - Meta batida?
                      │ - Mês                                   │ - Ordenação
                      │                                         │
                      ▼                                         ▼
              📊 Tabela de Registros                  🏆 Ranking dos GNs
```

---

## 🎨 Camadas da Aplicação

### 1. Apresentação (UI Layer)
```
components/ui/
├── Button, Input, Label        # Inputs básicos
├── Card                        # Containers
├── Select                      # Dropdowns
└── Tabs                        # Navegação
```

### 2. Lógica de Negócio (Business Layer)
```
app/page.tsx
├── Estados (useState)
├── Validações
├── Comunicação com API (fetch)
└── Gerenciamento de formulário
```

### 3. Acesso a Dados (Data Layer)
```
app/api/fechamentos/
├── route.ts                    # CRUD de fechamentos
└── ranking/route.ts            # Agregações e cálculos
```

### 4. Persistência (Database Layer)
```
prisma/
├── schema.prisma               # Definição do modelo
└── Prisma Client               # ORM type-safe
```

---

## 🔐 Segurança

### Implementado:
✅ Validação de entrada (frontend)  
✅ Validação de tipos (TypeScript)  
✅ Sanitização de dados (Prisma)  
✅ CORS padrão do Next.js  

### A Implementar (Próximas Fases):
⏳ Autenticação de usuários  
⏳ Autorização por nível  
⏳ Rate limiting  
⏳ HTTPS em produção  
⏳ Criptografia de dados sensíveis  

---

## ⚡ Performance

### Otimizações Atuais:
✅ React Server Components (Next.js 14)  
✅ Consultas otimizadas (Prisma)  
✅ CSS otimizado (Tailwind JIT)  
✅ Bundle splitting automático  

### Próximas Otimizações:
⏳ Cache de consultas (React Query)  
⏳ Paginação de dados  
⏳ Lazy loading de componentes  
⏳ Service Workers (PWA)  
⏳ CDN para assets  

---

## 🚀 Deploy Sugerido

### Opção 1: Vercel (Recomendado para Next.js)
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar banco de dados
# Usar Vercel Postgres ou outro provider
```

### Opção 2: Railway
```bash
# 1. Conectar repositório GitHub
# 2. Railway detecta Next.js automaticamente
# 3. Adicionar PostgreSQL plugin
# 4. Deploy automático
```

### Opção 3: Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Métricas do Sistema

### Código
- **Arquivos TypeScript**: 13
- **Componentes React**: 12
- **API Endpoints**: 2
- **Modelos de Dados**: 2

### Funcionalidades
- ✅ Formulário de lançamento
- ✅ Múltiplos credenciamentos
- ✅ Tabela de visualização
- ✅ Ranking dos GNs
- ✅ Filtros por período
- ✅ Sistema de metas
- ✅ Design responsivo

---

## 🛠️ Stack Tecnológica

| Camada       | Tecnologia       | Versão | Finalidade              |
|--------------|------------------|--------|-------------------------|
| Framework    | Next.js          | 14.2   | React full-stack        |
| Linguagem    | TypeScript       | 5.4    | Type safety             |
| UI Library   | React            | 18.3   | Componentes             |
| Styling      | TailwindCSS      | 3.4    | CSS utility-first       |
| Components   | ShadCN UI        | -      | Componentes pré-feitos  |
| ORM          | Prisma           | 5.14   | Database toolkit        |
| Database     | SQLite           | -      | Banco de dados local    |
| Charts       | Recharts         | 2.12   | Gráficos (futuro)       |
| Validation   | Zod              | 3.23   | Schema validation       |
| Date Utils   | date-fns         | 3.6    | Manipulação de datas    |

---

## 🎯 Princípios de Design

1. **Mobile First**: Design responsivo desde o início
2. **Type Safety**: TypeScript em todo o código
3. **Component Driven**: Componentes reutilizáveis
4. **API First**: Backend separado do frontend
5. **Progressive Enhancement**: Funcionalidades incrementais
6. **User Centric**: Foco na experiência do usuário

---

**Arquitetura sólida, escalável e pronta para crescer! 🚀**

