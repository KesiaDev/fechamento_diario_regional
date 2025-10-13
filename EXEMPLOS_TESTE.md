# 🧪 Exemplos de Teste

## 🚀 Opção 1: Seed Automático (Recomendado)

### Instalar dependência
```bash
npm install -D tsx
```

### Executar seed
```bash
npx tsx seed.ts
```

Este comando irá:
- ✅ Limpar o banco de dados
- ✅ Criar 30 dias de histórico
- ✅ Popular com 8 executivos diferentes
- ✅ Gerar dados realistas automaticamente
- ✅ Criar cenários variados (GNs com meta batida, zerados, etc)

---

## 📝 Opção 2: Teste Manual - Dados de Exemplo

### Exemplo 1: GN com Meta Batida ✅

**Dados Principais:**
- Executivo: `João Silva`
- Agência: `AG 001 - Centro`
- Qtd Visitas: `8`
- Qtd Bra Expre: `4`

**Credenciamento 1:**
- Qtd Credenciamentos: `2`
- Ativações do Dia: `1500.00`
- EC: `1234567890`
- Volume R$: `2500.00`
- RA: `Sim`
- Cesta: `Cesta completa`
- PJ Instala Direto: `Sim`

**Credenciamento 2:**
- Qtd Credenciamentos: `1`
- Ativações do Dia: `800.00`
- EC: `9876543210`
- Volume R$: `1200.00`
- RA: `Não`
- Cesta: `Cesta básica`
- PJ Instala Direto: `Não`

---

### Exemplo 2: GN Abaixo da Meta ⚠️

**Dados Principais:**
- Executivo: `Maria Santos`
- Agência: `AG 002 - Zona Sul`
- Qtd Visitas: `5`
- Qtd Bra Expre: `2`

**Credenciamento 1:**
- Qtd Credenciamentos: `1`
- Ativações do Dia: `500.00`
- EC: `5555555555`
- Volume R$: `800.00`
- RA: `Sim`
- Cesta: `Cesta premium`
- PJ Instala Direto: `Sim`

---

### Exemplo 3: GN Zerado ❌

**Dados Principais:**
- Executivo: `Carlos Oliveira`
- Agência: `AG 003 - Zona Norte`
- Qtd Visitas: `3`
- Qtd Bra Expre: `1`

**Credenciamento 1:**
- Qtd Credenciamentos: `0`
- Ativações do Dia: `0.00`
- EC: `0000000000`
- Volume R$: `0.00`
- RA: `Não`
- Cesta: `-`
- PJ Instala Direto: `Não`

---

### Exemplo 4: GN Top Performer 🥇

**Dados Principais:**
- Executivo: `Ana Paula`
- Agência: `AG 004 - Zona Oeste`
- Qtd Visitas: `12`
- Qtd Bra Expre: `6`

**Credenciamento 1:**
- Qtd Credenciamentos: `3`
- Ativações do Dia: `2500.00`
- EC: `1111111111`
- Volume R$: `4000.00`
- RA: `Sim`
- Cesta: `Cesta personalizada`
- PJ Instala Direto: `Sim`

**Credenciamento 2:**
- Qtd Credenciamentos: `2`
- Ativações do Dia: `1800.00`
- EC: `2222222222`
- Volume R$: `3000.00`
- RA: `Sim`
- Cesta: `Cesta completa`
- PJ Instala Direto: `Sim`

**Credenciamento 3:**
- Qtd Credenciamentos: `1`
- Ativações do Dia: `900.00`
- EC: `3333333333`
- Volume R$: `1500.00`
- RA: `Não`
- Cesta: `Cesta básica`
- PJ Instala Direto: `Não`

---

## 🎯 Cenários de Teste

### 1️⃣ Teste de Validação

**Objetivo:** Verificar se as validações estão funcionando

**Passos:**
1. Tente enviar formulário vazio → ❌ Deve dar erro
2. Preencha só os campos principais → ❌ Deve pedir credenciamento
3. Coloque EC com 9 dígitos → ❌ Deve pedir 10 dígitos
4. Coloque EC com letras → ❌ Deve aceitar só números
5. Preencha tudo corretamente → ✅ Deve salvar

---

### 2️⃣ Teste de Múltiplos Credenciamentos

**Objetivo:** Testar adição de vários credenciamentos

**Passos:**
1. Clique em "+ Adicionar Credenciamento" 3 vezes
2. Preencha os 4 cards de credenciamento
3. Salve
4. Verifique na tabela se mostra total correto

---

### 3️⃣ Teste de Filtros

**Objetivo:** Verificar filtros de período

**Preparação:**
- Execute o seed para ter dados de 30 dias

**Passos:**
1. Selecione filtro "Hoje" → Veja registros de hoje
2. Selecione filtro "Esta Semana" → Veja últimos 7 dias
3. Selecione filtro "Este Mês" → Veja últimos 30 dias
4. Verifique se o ranking muda conforme filtro

---

### 4️⃣ Teste de Ranking

**Objetivo:** Verificar cálculo e ordenação do ranking

**Preparação:**
- Crie lançamentos para 3 GNs diferentes:
  - GN 1: 5 credenciamentos (bateu meta)
  - GN 2: 1 credenciamento (abaixo da meta)
  - GN 3: 0 credenciamentos (zerado)

**Verificações:**
1. GN 1 deve aparecer em 1º lugar (🥇)
2. GN 2 deve aparecer com ⚠️ (abaixo da meta)
3. GN 3 deve aparecer com ❌ (zerado)
4. Ordem deve ser por qtd de credenciamentos

---

### 5️⃣ Teste de Responsividade

**Objetivo:** Verificar layout mobile

**Passos:**
1. Abra DevTools (F12)
2. Ative modo responsivo (Ctrl+Shift+M)
3. Teste em:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)
4. Verifique se tudo está legível e clicável

---

## 📊 Dados Gerados pelo Seed

O script `seed.ts` gera:

| Elemento | Quantidade | Observação |
|----------|-----------|------------|
| Executivos | 8 | Nomes variados |
| Agências | 5 | Diferentes zonas |
| Dias de histórico | 30 | Último mês |
| Fechamentos | ~150-200 | Varia por probabilidade |
| Credenciamentos | ~300-500 | 0 a 4 por fechamento |
| Valor total ativado | ~R$ 500k-1M | Valores aleatórios realistas |

### Distribuição:
- 🥇 Top performers: ~2-3 GNs
- ✅ Meta batida: ~3-4 GNs
- ⚠️ Abaixo da meta: ~2-3 GNs
- ❌ Zerados: ~1-2 GNs

---

## 🔄 Resetar Dados de Teste

### Limpar tudo
```bash
rm prisma/dev.db
npx prisma db push
```

### Popular novamente
```bash
npx tsx seed.ts
```

---

## 💡 Dicas de Teste

1. **Teste com dados reais**: Use nomes e agências reais da sua operação
2. **Teste edge cases**: Zero credenciamentos, muitos credenciamentos, valores altos
3. **Teste em diferentes horários**: Manhã, tarde, noite
4. **Teste concorrência**: Dois GNs salvando ao mesmo tempo
5. **Teste performance**: Com 1000+ registros (rode seed 5x)

---

## ✅ Checklist de Testes

- [ ] Formulário vazio dá erro
- [ ] Validação de EC (10 dígitos)
- [ ] Adicionar/Remover credenciamentos
- [ ] Salvar com 1 credenciamento
- [ ] Salvar com múltiplos credenciamentos
- [ ] Tabela exibe dados corretamente
- [ ] Filtro "Hoje" funciona
- [ ] Filtro "Esta Semana" funciona
- [ ] Filtro "Este Mês" funciona
- [ ] Ranking ordena corretamente
- [ ] Meta é calculada corretamente
- [ ] Medalhas 🥇🥈🥉 aparecem
- [ ] Status ✅⚠️❌ corretos
- [ ] Layout responsivo funciona
- [ ] Seed popula banco corretamente

---

**Pronto para testar! 🚀**

