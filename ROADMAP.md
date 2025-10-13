# 🗺️ Roadmap - Próximas Funcionalidades

## ✅ Fase 1 - Concluída

- [x] Configuração do projeto Next.js
- [x] Configuração Prisma + SQLite
- [x] Componentes ShadCN UI
- [x] Formulário de lançamento funcional
- [x] Sistema de múltiplos credenciamentos
- [x] API Routes (criar e listar)
- [x] Tabela de registros com filtros
- [x] Ranking dos GNs
- [x] Sistema de metas
- [x] Filtros por período (dia, semana, mês)
- [x] Design responsivo

---

## 🚧 Fase 2 - Dashboards e Gráficos

### 📊 Gráficos a Implementar

#### 1. Gráfico de Barras - Credenciamentos por GN
```
Tipo: Barras verticais
Biblioteca: Recharts
Dados: Total de credenciamentos por executivo
Filtros: Dia, semana, mês
Cores: Azul para meta batida, Laranja para abaixo da meta
```

#### 2. Gráfico de Linhas - Evolução Temporal
```
Tipo: Linha
Dados: Evolução diária de credenciamentos
Período: Últimos 7, 15 ou 30 dias
Útil para: Identificar tendências
```

#### 3. Gráfico de Pizza - Distribuição de RA
```
Tipo: Pizza (Donut)
Dados: % de credenciamentos com RA Sim vs Não
Cores: Verde (Sim), Vermelho (Não)
```

#### 4. Gráfico de Área - Volume R$ Ativado
```
Tipo: Área empilhada
Dados: Volume total ativado por dia
Filtros: Semana, mês
```

#### 5. Heatmap - Desempenho Semanal
```
Tipo: Heatmap/Tabela de calor
Dados: Credenciamentos por dia da semana
Cores: Verde (alto), Amarelo (médio), Vermelho (baixo)
```

### 📈 Componentes do Dashboard

```tsx
// Exemplo de estrutura
app/
├── dashboard/
│   ├── page.tsx              # Dashboard principal
│   ├── components/
│   │   ├── BarChartCredenciamentos.tsx
│   │   ├── LineChartEvolucao.tsx
│   │   ├── PieChartRA.tsx
│   │   ├── AreaChartVolume.tsx
│   │   └── MetricsCards.tsx   # Cards de métricas
```

### 🎯 KPIs a Exibir

1. **Total de Credenciamentos** (período)
2. **Meta Atingida** (%)
3. **Valor Total Ativado** (R$)
4. **Média por GN**
5. **Taxa de RA** (%)
6. **Top Performer** (melhor GN)
7. **Pior Desempenho** (GN que precisa de atenção)

---

## 📤 Fase 3 - Exportação de Dados

### Excel
- Biblioteca: `xlsx` ou `exceljs`
- Formato: `.xlsx`
- Dados: Tabela completa + resumo
- Botão: "📥 Exportar para Excel"

### PDF
- Biblioteca: `jspdf` + `html2canvas`
- Formato: `.pdf`
- Layout: Relatório completo com gráficos
- Botão: "📄 Gerar PDF"

### CSV
- Nativo do JavaScript
- Formato: `.csv`
- Uso: Importação em outras ferramentas
- Botão: "📊 Exportar CSV"

---

## 🔐 Fase 4 - Autenticação

- [ ] Login de usuários
- [ ] Níveis de acesso (GN, Gerente, Admin)
- [ ] Histórico por usuário
- [ ] Dashboard personalizado

### Opções de Autenticação:
1. **NextAuth.js** (recomendado)
2. **Clerk**
3. **Auth0**

---

## 🗄️ Fase 5 - Banco de Dados em Produção

### Migração SQLite → PostgreSQL

```env
# .env.production
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**Opções de hospedagem:**
- Vercel Postgres
- Supabase
- Railway
- Neon
- PlanetScale (MySQL)

---

## 🎨 Fase 6 - Melhorias de UX/UI

- [ ] Modo escuro
- [ ] Animações (Framer Motion)
- [ ] Toasts de notificação (Sonner)
- [ ] Loading states melhores
- [ ] Skeleton screens
- [ ] PWA (Progressive Web App)
- [ ] Notificações push

---

## 📱 Fase 7 - Mobile

- [ ] App móvel com React Native
- [ ] Lançamento offline-first
- [ ] Sincronização automática

---

## 🤖 Fase 8 - Automação

- [ ] Envio automático de relatórios por e-mail
- [ ] Alertas para GNs abaixo da meta
- [ ] Integração com WhatsApp (mensagens automáticas)
- [ ] Dashboard público para TV/Monitor

---

## 🔄 Fase 9 - Integrações

- [ ] API REST completa
- [ ] Webhooks
- [ ] Integração com CRM CIELO
- [ ] Importação de dados de planilhas
- [ ] Sincronização com sistemas legados

---

## 📊 Exemplo de Implementação - Gráfico de Barras

```tsx
// components/charts/BarChartCredenciamentos.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function BarChartCredenciamentos({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="executivo" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalCredenciamentos" fill="#3b82f6" name="Credenciamentos" />
        <Bar dataKey="meta" fill="#94a3b8" name="Meta" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

### Uso na página:

```tsx
// app/dashboard/page.tsx
import { BarChartCredenciamentos } from '@/components/charts/BarChartCredenciamentos'

// ... dentro do componente
<Card>
  <CardHeader>
    <CardTitle>Credenciamentos por GN</CardTitle>
  </CardHeader>
  <CardContent>
    <BarChartCredenciamentos data={ranking} />
  </CardContent>
</Card>
```

---

## 🎯 Prioridades Sugeridas

1. **Imediato**: Gráficos básicos (Barras + Linhas)
2. **Curto prazo**: Exportação Excel/PDF
3. **Médio prazo**: Autenticação + PostgreSQL
4. **Longo prazo**: Mobile App + Automações

---

## 💡 Sugestões de Melhorias

### Performance
- [ ] Paginação na tabela
- [ ] Cache de dados (React Query / SWR)
- [ ] Lazy loading de componentes

### Funcionalidades
- [ ] Comentários em lançamentos
- [ ] Anexar comprovantes (fotos)
- [ ] Histórico de edições
- [ ] Metas personalizadas por GN
- [ ] Campanhas/Períodos especiais

### Analytics
- [ ] Google Analytics
- [ ] Mixpanel
- [ ] Hotjar (heatmaps de uso)

---

**Quer implementar alguma dessas funcionalidades?**  
Estou pronto para evoluir o sistema! 🚀

