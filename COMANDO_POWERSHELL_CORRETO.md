# ✅ Comando CORRETO para PowerShell (Windows)

## ❌ O Problema

O comando do Railway usa sintaxe do **bash/Linux**:
```bash
PGPASSWORD=senha psql -h host -U postgres...
```

Mas no **PowerShell (Windows)** isso não funciona!

---

## ✅ Solução: Usar Sintaxe do PowerShell

### Método 1: Definir Variável e Executar

No PowerShell, digite:

```powershell
$env:PGPASSWORD="SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM"; psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
```

**Substitua a senha pela sua!** (mas parece que você já copiou ela)

---

### Método 2: Executar em 2 Linhas (Mais Fácil)

**Linha 1:**
```powershell
$env:PGPASSWORD="SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM"
```

Pressione Enter

**Linha 2:**
```powershell
psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
```

Pressione Enter

---

## 🎯 PASSOS COMPLETOS

### 1. No PowerShell, Digite:

```powershell
$env:PGPASSWORD="SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM"
```

Pressione **Enter**

### 2. Depois Digite:

```powershell
psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
```

Pressione **Enter**

### 3. Se Pedir Senha:

Cole a senha: `SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM`

Pressione **Enter**

### 4. Quando Conectar:

Você verá:
```
railway=# 
```

### 5. Cole o SQL:

Agora cole TODO o conteúdo do arquivo `SQL_COPIAR_COLAR.txt`

### 6. Pressione Enter

### 7. Pronto!

---

## 🆘 Se Ainda Der Erro "comando não encontrado"

Isso significa que você NÃO tem o psql instalado!

### Instalar psql:

1. Baixe: https://www.postgresql.org/download/windows/
2. Ou instale via Chocolatey:
   ```powershell
   choco install postgresql
   ```

**Depois tente novamente!**

