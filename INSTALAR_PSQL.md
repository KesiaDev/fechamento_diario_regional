# 📥 Como Instalar psql no Windows

## Opção 1: Instalar PostgreSQL Completo

1. Abra o navegador
2. Vá para: **https://www.postgresql.org/download/windows/**
3. Clique em **"Download the installer"**
4. Baixe a versão mais recente
5. Execute o instalador
6. Durante a instalação:
   - Escolha "PostgreSQL Server" e **"Command Line Tools"**
   - Anote a senha que você criar
   - Escolha a porta padrão: 5432
   - Next em tudo
7. **Após instalar, reinicie o PowerShell!**

---

## Opção 2: Instalar Apenas o Cliente (Mais Leve)

1. Baixe de: **https://get.enterprisedb.com/postgresql/postgresql-15.7-1-windows-x64.exe**
2. Execute o instalador
3. Marque apenas **"Command Line Tools"**
4. Instale
5. **Reinicie o PowerShell**

---

## Verificar se Instalou

Depois de reiniciar o PowerShell, digite:

```powershell
psql --version
```

Se aparecer uma versão (ex: "psql 15.7"), está funcionando! ✅

---

## Depois de Instalar

Volte e execute o comando novamente:
```powershell
$env:PGPASSWORD="SrRGfkCcrdRUwhEotpEYBFpOwZJGXuaM"
psql -h shuttle.proxy.rlwy.net -U postgres -p 47343 -d railway
```

