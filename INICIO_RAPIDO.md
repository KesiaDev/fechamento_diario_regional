# ⚡ Início Rápido - 3 Minutos

## 🎯 Instalação Automática (Recomendado)

### Windows (PowerShell)
```powershell
.\install.ps1
```

### macOS/Linux
```bash
chmod +x install.sh
./install.sh
```

---

## 📝 Instalação Manual

Se preferir fazer passo a passo:

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar arquivo `.env` na raiz do projeto
```
DATABASE_URL="file:./dev.db"
```

### 3. Configurar banco de dados
```bash
npx prisma generate
npx prisma db push
```

### 4. Iniciar servidor
```bash
npm run dev
```

### 5. Acessar no navegador
```
http://localhost:3000
```

---

## ✅ Teste Rápido

1. Abra http://localhost:3000
2. Preencha o formulário:
   - **Executivo**: João Silva
   - **Agência**: AG 001
   - **Visitas**: 5
   - **Bra Expre**: 3
   - **Qtd Credenciamentos**: 2
   - **Ativações**: 1500.00
   - **EC**: 1234567890
   - **Volume R$**: 2500.00
   - **RA**: Sim
   - **Cesta**: Cesta completa
   - **PJ Instala Direto**: Sim
3. Clique em **"Salvar Fechamento"**
4. Vá na aba **"📊 Ranking"** para ver o resultado

---

## 🎨 Screenshots do Sistema

### 📝 Tela de Lançamento
- Formulário completo com validações
- Múltiplos credenciamentos por GN
- Cards organizados e responsivos

### 📊 Tela de Ranking
- Top 3 GNs em destaque (🥇🥈🥉)
- Indicadores visuais de meta
- Filtros por período

---

## 🔧 Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Visualizar banco de dados (Prisma Studio)
npx prisma studio

# Resetar banco de dados
rm prisma/dev.db
npx prisma db push

# Build para produção
npm run build
npm start
```

---

## 📚 Estrutura de Pastas

```
Fechamento_Diario/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout global
├── components/ui/         # Componentes ShadCN
├── lib/                   # Utilitários
├── prisma/               # Schema e migrations
│   └── schema.prisma     # Modelo de dados
└── package.json          # Dependências
```

---

## 🆘 Problemas?

**Erro: "Cannot find module"**
```bash
npm install
```

**Erro: "Database not found"**
```bash
npx prisma db push
```

**Porta 3000 em uso?**
```bash
# Windows
netstat -ano | findstr :3000
# Depois mate o processo ou use outra porta

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🚀 Próximos Passos

Depois de testar, você pode:

1. ✅ Adicionar mais GNs
2. ✅ Visualizar relatórios por período
3. ✅ Acompanhar o ranking em tempo real
4. 📊 Implementar gráficos (futuro)
5. 📤 Exportar relatórios (futuro)

---

**Desenvolvido com ❤️ para CIELO**

