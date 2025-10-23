# 🎓 Guia para Iniciantes - Como Testar o Sistema

> **Para quem está começando na programação**  
> Explicações simples, passo a passo, sem termos complicados

---

## 📍 Você está aqui: `C:\Users\User\Desktop\Fechamento_Diario`

Isso significa que todos os arquivos do sistema já estão na sua área de trabalho (Desktop).

---

## 🎯 Objetivo

Vamos fazer o sistema funcionar no seu computador e você vai poder testar tudo!

---

## 📝 Passo 1: Abrir o PowerShell na pasta certa

### O que é PowerShell?
É uma janela preta/azul onde você digita comandos para o computador executar.

### Como abrir:

**Opção A - Mais Fácil:**
1. Vá até a área de trabalho (Desktop)
2. Abra a pasta `Fechamento_Diario`
3. Clique com o botão direito em um espaço vazio
4. Procure por "Abrir no Terminal" ou "Abrir com PowerShell"

**Opção B - Alternativa:**
1. Pressione `Windows + R`
2. Digite: `powershell`
3. Aperte Enter
4. Digite isso (vai entrar na pasta):
   ```powershell
   cd C:\Users\User\Desktop\Fechamento_Diario
   ```
5. Aperte Enter

### ✅ Como saber se deu certo?
Você deve ver algo parecido com isso no PowerShell:
```
PS C:\Users\User\Desktop\Fechamento_Diario>
```

---

## 📦 Passo 2: Instalar as Dependências

### O que são dependências?
São "bibliotecas" ou "ferramentas" que o sistema precisa para funcionar. É como instalar programas auxiliares.

### Como instalar:

1. No PowerShell que você abriu, digite:
   ```powershell
   npm install
   ```

2. Aperte **Enter**

3. Aguarde... (pode demorar 2-5 minutos)

### 📺 O que você vai ver:
```
npm install
⠋ Installing packages...
⠙ Installing packages...
added 245 packages in 2m

15 packages are looking for funding
  run `npm fund` for details
```

### ✅ Como saber se deu certo?
- Você vai ver várias linhas passando rapidamente
- No final, deve aparecer: `added XXX packages`
- E aparecer novamente: `PS C:\Users\User\Desktop\Fechamento_Diario>`

### ❌ Se der erro:
- Veja a seção "Resolução de Problemas" no final

---

## 🗄️ Passo 3: Criar o arquivo .env

### O que é .env?
É um arquivo de configuração que diz ao sistema onde salvar os dados.

### Como criar:

**Digite este comando no PowerShell:**
```powershell
echo 'DATABASE_URL="file:./dev.db"' | Out-File -FilePath .env -Encoding UTF8
```

**Aperte Enter**

### ✅ Como saber se deu certo?
- Não vai aparecer nenhuma mensagem (isso é bom!)
- Se quiser confirmar, olhe na pasta do projeto, deve ter aparecido um arquivo chamado `.env`

---

## 🗃️ Passo 4: Configurar o Banco de Dados

### O que é isso?
É preparar o local onde o sistema vai guardar os dados dos lançamentos.

### Parte A - Gerar o Prisma Client:

**Digite:**
```powershell
npx prisma generate
```

**Aperte Enter e aguarde...**

### 📺 O que você vai ver:
```
✔ Generated Prisma Client (5.14.0) to .\node_modules\@prisma\client
```

### Parte B - Criar o banco:

**Digite:**
```powershell
npx prisma db push
```

**Aperte Enter**

### 📺 O que você vai ver:
```
🚀  Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client (5.14.0)
```

### ✅ Como saber se deu certo?
- Deve aparecer mensagem de sucesso em verde
- Na pasta `prisma`, deve ter sido criado um arquivo `dev.db`

---

## 🎲 Passo 5 (OPCIONAL): Popular com dados de teste

### Por que fazer isso?
Para você não precisar preencher formulários manualmente. O sistema vai criar dados fictícios automaticamente!

### Como fazer:

**Primeiro, instale a ferramenta tsx:**
```powershell
npm install -D tsx
```

**Aguarde terminar, depois execute o seed:**
```powershell
npm run seed
```

### 📺 O que você vai ver:
```
🌱 Iniciando seed do banco de dados...

🗑️  Limpando dados existentes...
✅ Dados limpos!

📊 Criando fechamentos...
✅ 180 fechamentos criados!
✅ 320 credenciamentos criados!

📈 Estatísticas:
  📝 Total de fechamentos: 180
  📊 Total de credenciamentos: 320
  💰 Total ativado: R$ 789543.50
  👥 Executivos: 8
  🏢 Agências: 5

✅ Seed concluído com sucesso!
```

### ✅ Como saber se deu certo?
- Você vai ver as mensagens verdes de sucesso
- Vai mostrar quantos registros foram criados

---

## 🚀 Passo 6: INICIAR O SISTEMA!

### É aqui que a mágica acontece! 🎉

**Digite:**
```powershell
npm run dev
```

**Aperte Enter**

### 📺 O que você vai ver:
```
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.5s
```

### ✅ SUCESSO! O sistema está rodando! 🎊

**IMPORTANTE:** 
- ⚠️ NÃO FECHE essa janela do PowerShell!
- Ela precisa ficar aberta enquanto você usa o sistema
- Se fechar, o sistema para de funcionar

---

## 🌐 Passo 7: Acessar o Sistema no Navegador

### Como acessar:

1. Abra seu navegador favorito (Chrome, Edge, Firefox...)
2. Na barra de endereço, digite:
   ```
   localhost:3000
   ```
3. Aperte **Enter**

### 🎨 O que você deve ver:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│      Fechamento Diário - CIELO                  │
│      Sistema de acompanhamento dos Gerentes     │
│                                                 │
│  [ 📝 Lançamento ]  [ 📊 Ranking ]              │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Novo Lançamento                        │   │
│  │  Registre o fechamento do dia           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 🎉 PARABÉNS! O sistema está funcionando!

---

## 🧪 Passo 8: Fazer seu Primeiro Teste

### Se você FEZ O SEED (Passo 5):

1. Clique na aba **"📊 Ranking"**
2. Você vai ver vários Gerentes com seus dados
3. Experimente mudar o filtro de **"Hoje"** para **"Esta Semana"** ou **"Este Mês"**
4. Veja como os dados mudam!

### Se você NÃO FEZ O SEED:

Vamos criar um lançamento manualmente!

**Preencha o formulário assim:**

**Campos Principais:**
- **Executivo (GN):** Digite seu nome (ex: Maria Silva)
- **Agência Visitada:** Digite qualquer agência (ex: AG 001 - Centro)
- **Qtd de Visitas:** Digite um número (ex: 5)
- **Qtd Bra Expre:** Digite um número (ex: 2)

**Credenciamento #1:**
- **Qtd Credenciamentos:** Digite 2
- **Volume R$:** Digite 1500.00
- **EC (10 números):** Digite 1234567890
- **Volume R$:** Digite 2500.00
- **RA:** Selecione "Sim"
- **Cesta:** Digite "Cesta completa"
- **PJ Instala Direto:** Selecione "Sim"

**Agora clique no botão azul:** `💾 Salvar Fechamento`

### ✅ O que deve acontecer:
- Um alerta verde deve aparecer: "Fechamento salvo com sucesso!"
- O formulário fica limpo (pronto para outro lançamento)
- Role a página para baixo e veja seu registro na tabela!

---

## 🎮 Experimentando as Funcionalidades

### 1. Adicionar Múltiplos Credenciamentos

1. Preencha os campos principais novamente
2. Clique em **"+ Adicionar Credenciamento"**
3. Veja aparecer um novo card (Credenciamento #2)
4. Preencha os dois credenciamentos
5. Salve

### 2. Ver a Tabela de Registros

1. Role a página para baixo
2. Veja todos os lançamentos que você fez
3. Experimente o filtro: **Hoje / Esta Semana / Este Mês**

### 3. Ver o Ranking

1. Clique na aba **"📊 Ranking"**
2. Veja o ranking dos GNs
3. Note as medalhas 🥇🥈🥉 para os top 3
4. Veja os status: ✅ (meta batida), ⚠️ (abaixo), ❌ (zerado)

---

## 📱 Testando no Celular (Opcional)

Se quiser testar como fica no celular:

1. No navegador, aperte **F12** (abre as ferramentas de desenvolvedor)
2. Clique no ícone de celular (ou aperte Ctrl+Shift+M)
3. Escolha um modelo de celular (iPhone, Samsung...)
4. Veja como o site se adapta!

---

## 🛑 Como Parar o Sistema

Quando terminar de testar:

1. Vá até o PowerShell (aquela janela que ficou aberta)
2. Aperte **Ctrl + C** (duas vezes se necessário)
3. O sistema vai parar

### Como iniciar de novo depois:

1. Abra o PowerShell na pasta do projeto
2. Digite: `npm run dev`
3. Pronto!

---

## ❌ Resolução de Problemas

### Erro: "npm não é reconhecido"

**Problema:** Node.js não está instalado ou não está no PATH

**Solução:**
1. Instale o Node.js: https://nodejs.org (versão LTS)
2. Reinicie o computador
3. Tente novamente

---

### Erro: "Cannot find module"

**Problema:** Dependências não foram instaladas

**Solução:**
```powershell
npm install
```

---

### Erro: "Port 3000 is already in use"

**Problema:** Já tem algo rodando na porta 3000

**Solução A - Fechar o que está usando:**
```powershell
netstat -ano | findstr :3000
```
(Vai mostrar um número - o PID)

```powershell
taskkill /PID <número> /F
```
(Substitua `<número>` pelo PID que apareceu)

**Solução B - Usar outra porta:**
```powershell
npm run dev -- -p 3001
```
(Acesse: localhost:3001)

---

### Erro: "Prisma Client not found"

**Problema:** Prisma Client não foi gerado

**Solução:**
```powershell
npx prisma generate
```

---

### Erro: Database não encontrado

**Problema:** Banco não foi criado

**Solução:**
```powershell
npx prisma db push
```

---

### Página em branco ou erro 404

**Problema:** Sistema não está rodando

**Solução:**
1. Certifique-se que o PowerShell está aberto com `npm run dev` rodando
2. Verifique se aparece "Ready in X.Xs"
3. Acesse exatamente: `localhost:3000`

---

### Não consigo salvar o formulário

**Problema:** Algum campo está faltando ou inválido

**Solução:**
1. Verifique se todos os campos estão preenchidos
2. O EC deve ter EXATAMENTE 10 números (1234567890)
3. Valores em R$ use ponto, não vírgula (1500.00, não 1500,00)

---

## 📊 Comandos Úteis - Resumo

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia o sistema |
| `npm run seed` | Cria dados de teste |
| `npm run db:studio` | Abre interface para ver o banco de dados |
| `npm run db:reset` | Limpa e recria tudo |

---

## 🎓 Glossário (Termos que você pode encontrar)

| Termo | O que significa |
|-------|-----------------|
| **PowerShell** | Janela onde você digita comandos |
| **npm** | Gerenciador de pacotes (instala ferramentas) |
| **Node.js** | Programa que roda JavaScript no computador |
| **localhost** | Endereço do seu próprio computador |
| **3000** | Porta (número da "entrada" do sistema) |
| **Banco de dados** | Onde os dados são salvos |
| **API** | Parte do sistema que salva/busca dados |
| **Frontend** | Parte visual do sistema (o que você vê) |
| **Backend** | Parte que processa dados (invisível) |

---

## 🆘 Ainda com Dúvidas?

### Dicas:
1. Leia as mensagens de erro com calma
2. Copie o erro e procure no Google
3. Verifique se seguiu todos os passos
4. Tente fechar tudo e começar de novo

### Arquivos de Ajuda:
- `COMECE_AQUI.md` - Checklist simples
- `SETUP.md` - Setup detalhado com troubleshooting
- `README.md` - Documentação técnica completa

---

## ✅ Checklist de Teste

Marque o que você já conseguiu fazer:

### Instalação
- [ ] Node.js instalado e funcionando
- [ ] PowerShell aberto na pasta correta
- [ ] `npm install` executado com sucesso
- [ ] Arquivo `.env` criado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] (Opcional) `npm run seed` executado

### Execução
- [ ] `npm run dev` rodando sem erros
- [ ] Acessei localhost:3000
- [ ] Página carregou corretamente

### Testes
- [ ] Consegui preencher o formulário
- [ ] Consegui salvar um lançamento
- [ ] Vi o registro na tabela
- [ ] Testei o botão "+ Adicionar Credenciamento"
- [ ] Salvei com múltiplos credenciamentos
- [ ] Acessei a aba "Ranking"
- [ ] Testei os filtros (Dia/Semana/Mês)

---

## 🎉 Você Conseguiu!

Se você marcou todos os itens acima, **parabéns!** 🎊

Você testou com sucesso o Sistema de Fechamento Diário CIELO!

---

## 💡 Próximos Passos

Agora que você sabe usar o sistema, pode:

1. **Experimentar cenários diferentes:**
   - GN com muitos credenciamentos
   - GN sem credenciamentos (zerado)
   - Vários GNs no mesmo dia

2. **Explorar a interface:**
   - Veja como fica no celular
   - Teste em navegadores diferentes
   - Experimente adicionar 5+ credenciamentos

3. **Conhecer o código:**
   - Abra a pasta do projeto
   - Veja os arquivos na pasta `app`
   - Entenda como funciona (com calma!)

---

<div align="center">

**Parabéns por chegar até aqui!** 🌟

Você deu os primeiros passos no mundo da programação!

💪 Continue praticando e explorando!

</div>

