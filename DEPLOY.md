# 🚀 Guia de Deploy - Colocar no Ar

## 🎯 Objetivo

Colocar o sistema no ar para sua equipe acessar via internet.

---

## 🌐 Opção 1: Vercel (GRATUITO - Recomendado)

### **Vantagens:**
- ✅ 100% GRATUITO
- ✅ Deploy automático
- ✅ Domínio próprio (ex: fechamento-cielo.vercel.app)
- ✅ HTTPS automático
- ✅ Muito fácil

### **Passo a Passo:**

#### **1. Criar Conta no Vercel**
1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Use sua conta do GitHub (recomendado)

#### **2. Preparar o Projeto**
1. Crie uma conta no GitHub (se não tiver)
2. Crie um repositório chamado "fechamento-diario"
3. Faça upload dos arquivos do projeto

#### **3. Deploy no Vercel**
1. Acesse: https://vercel.com/new
2. Conecte com GitHub
3. Selecione o repositório "fechamento-diario"
4. Clique em "Deploy"

#### **4. Configurar Variáveis de Ambiente**
No Vercel, vá em Settings → Environment Variables:
```
DATABASE_URL=file:./dev.db
```

#### **5. Pronto!**
- Sistema online em: `https://fechamento-diario.vercel.app`
- Compartilhe o link com sua equipe!

---

## 🌐 Opção 2: Railway (GRATUITO)

### **Vantagens:**
- ✅ 100% GRATUITO
- ✅ Banco PostgreSQL incluído
- ✅ Deploy automático

### **Passo a Passo:**

#### **1. Criar Conta no Railway**
1. Acesse: https://railway.app
2. Clique em "Login"
3. Use sua conta do GitHub

#### **2. Deploy**
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório
4. Clique em "Deploy"

#### **3. Configurar Banco**
1. Adicione PostgreSQL plugin
2. Configure a variável DATABASE_URL
3. Execute as migrations

#### **4. Pronto!**
- Sistema online com domínio próprio
- Banco PostgreSQL funcionando

---

## 🌐 Opção 3: Netlify (GRATUITO)

### **Vantagens:**
- ✅ 100% GRATUITO
- ✅ Deploy automático
- ✅ Domínio próprio

### **Passo a Passo:**

#### **1. Criar Conta no Netlify**
1. Acesse: https://netlify.com
2. Clique em "Sign up"
3. Use sua conta do GitHub

#### **2. Deploy**
1. Clique em "New site from Git"
2. Conecte com GitHub
3. Selecione o repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`

#### **3. Pronto!**
- Sistema online com domínio próprio

---

## 💰 Opção 4: Servidor Pago

### **Opções:**
- **DigitalOcean**: $5/mês
- **AWS**: $10-20/mês
- **Google Cloud**: $10-20/mês
- **Azure**: $10-20/mês

### **Vantagens:**
- ✅ Controle total
- ✅ Domínio personalizado
- ✅ Banco dedicado
- ✅ Performance melhor

---

## 🎯 RECOMENDAÇÃO: Use Vercel

### **Por que Vercel:**
1. **GRATUITO** para projetos pessoais
2. **Muito fácil** de usar
3. **Deploy automático** quando você atualizar o código
4. **Domínio próprio** (ex: fechamento-cielo.vercel.app)
5. **HTTPS automático**
6. **Perfeito para Next.js**

---

## 📋 Checklist para Deploy:

### **Antes do Deploy:**
- [ ] Sistema funcionando localmente
- [ ] Banco limpo (sem dados de exemplo)
- [ ] Testado com dados reais
- [ ] Código no GitHub

### **Durante o Deploy:**
- [ ] Conta criada no Vercel
- [ ] Repositório conectado
- [ ] Deploy executado
- [ ] Variáveis de ambiente configuradas

### **Depois do Deploy:**
- [ ] Sistema acessível via internet
- [ ] Testado com dados reais
- [ ] Link compartilhado com equipe
- [ ] Documentação atualizada

---

## 🔗 Links Úteis:

- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Netlify**: https://netlify.com
- **GitHub**: https://github.com

---

## 🆘 Precisa de Ajuda?

### **Para Deploy no Vercel:**
1. Me diga se tem conta no GitHub
2. Te ajudo a criar o repositório
3. Te guio no deploy

### **Para Deploy em Outro Serviço:**
1. Me diga qual prefere
2. Te ajudo com os passos específicos

---

## 🎉 Resultado Final:

**Sistema online com:**
- ✅ Link público para sua equipe
- ✅ Domínio próprio
- ✅ HTTPS seguro
- ✅ Banco de dados funcionando
- ✅ Todas as funcionalidades ativas

**Sua equipe poderá acessar de qualquer lugar!** 🌍

---

**Qual opção você quer usar? Vercel (gratuito) ou outra?** 😊
