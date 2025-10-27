# 📋 Como Pegar DATABASE_URL do Railway

## 🎯 Passo a Passo

### 1️⃣ No Railway

1. Acesse: **https://railway.app**
2. Faça login
3. Clique no projeto PostgreSQL (card roxo)

### 2️⃣ Vá em Variables

1. No TOPO, clique na aba **"Variables"**
2. Você vai ver uma lista de variáveis
3. Procure por: **`DATABASE_URL`**

### 3️⃣ Copiar

1. Do lado de `DATABASE_URL`, você verá um ícone de **copiar** 📋
2. **Clique para copiar**
3. Formato será algo como:
   ```
   postgresql://postgres:senha@shuttle.proxy.rlwy.net:47343/railway
   ```

### 4️⃣ IMPORTANTE!

**Se NÃO aparecer `DATABASE_URL`:**

1. Vá em **"Settings"**
2. Procure por **"Connection Details"** ou **"Public Network"**
3. Pegue a **Connection String**

---

## ✅ Exemplo de Connection String

```
postgresql://postgres:SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM@shuttle.proxy.rlwy.net:47343/railway
```

**Copie ela COMPLETA!**

---

## 🎯 Depois de Copiar

Volte na Vercel e:
1. Cole no campo **Value** da variável `DATABASE_URL`
2. Clique em **Add**
3. Clique em **Deploy**

**Pronto!** 🎉

