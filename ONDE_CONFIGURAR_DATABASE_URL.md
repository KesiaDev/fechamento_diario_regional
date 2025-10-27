# 📍 ONDE Configurar DATABASE_URL na Vercel

## 🎯 PASSO A PASSO VISUAL

### 1️⃣ Abrir o Projeto na Vercel

1. Acesse: **https://vercel.com/dashboard**
2. Você verá uma lista de projetos
3. **Clique** no projeto **"fechamento-diario-regional"**

---

### 2️⃣ Ir em Settings

Na página do projeto, no **TOPO** você verá várias abas:

- **Deployments** (primeira aba)
- **Analytics**
- **Speed Insights**
- **Logs**
- **Settings** ← **CLIQUE AQUI!**

---

### 3️⃣ Ir em Environment Variables

Depois de clicar em **Settings**, você verá um menu **NA ESQUERDA**:

- **General**
- **Domains**
- **Environment Variables** ← **CLIQUE AQUI!**
- **Git**
- **Security**
- **Integrations**
- **Team**
- **Billing**

---

### 4️⃣ Adicionar Variável

Depois de clicar em **Environment Variables**, você verá:

- No topo: **Environment Variables**
- Um botão **"+ Add New"** → **CLIQUE AQUI!**

Vai abrir um formulário para adicionar variável.

---

### 5️⃣ Preencher o Formulário

No formulário que abriu:

1. **Key (Nome da variável):**
   - Digite: `DATABASE_URL`

2. **Value (Valor):**
   - Cole a string que você copiou do Railway

3. **Environments:**
   - ☑️ Production
   - ☑️ Preview  
   - ☑️ Development

4. Clique em **"Save"**

---

### 6️⃣ Copiar DATABASE_URL do Railway

#### No Railway:

1. Acesse: **https://railway.app**
2. Clique no projeto **PostgreSQL**
3. Clique na aba **"Variables"** (no topo)
4. Procure por **`DATABASE_URL`** ou **`DATABASE_PUBLIC_URL`**
5. Clique no **ícone de copiar** 📋
6. Cole no campo **Value** da Vercel

---

## ✅ VERIFICAÇÃO

Depois de salvar:

1. Você deve ver a variável na lista
2. Vai aparecer: `DATABASE_URL` com o valor mascarado
3. ✅ Configurado!

---

## 🚀 Fazer Redeploy

Depois de configurar:

1. Volte para a aba **"Deployments"**
2. No último deploy (que está com erro)
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos

---

## 🆘 Se Não Encontrar

**Me diga:**
- Quais abas você vê no topo da página do projeto Vercel?
- Há um menu na esquerda? Quais opções?
- Tire um print da tela e me envie!

**Vou te ajudar a encontrar!** 😊

---

## 📸 EXEMPLO DE ONDE PROCURAR

```
Vercel Dashboard
  └─ Projeto "fechamento-diario-regional" (clique aqui)
       └─ Aba "Settings" (topo da página)
            └─ Menu ESQUERDA "Environment Variables"
                 └─ Botão "+ Add New"
                      └─ Preencher formulário
                           └─ Salvar
```

**Siga esse caminho!** 🎯

