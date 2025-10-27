-- SQL para criar as tabelas no Railway PostgreSQL
-- Execute este SQL na aba "Query" do Railway

-- Criar tabela Fechamento
CREATE TABLE IF NOT EXISTS "Fechamento" (
  "id" TEXT NOT NULL,
  "gerenteEstadual" TEXT NOT NULL,
  "executivo" TEXT NOT NULL,
  "agencia" TEXT NOT NULL,
  "porteAgencia" TEXT,
  "gerentePJ" TEXT,
  "qtdVisitas" INTEGER NOT NULL,
  "qtdInteracoes" INTEGER NOT NULL,
  "qtdBraExpre" INTEGER NOT NULL,
  "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Fechamento_pkey" PRIMARY KEY ("id")
);

-- Criar tabela Credenciamento
CREATE TABLE IF NOT EXISTS "Credenciamento" (
  "id" TEXT NOT NULL,
  "fechamentoId" TEXT NOT NULL,
  "qtdCredenciamentos" INTEGER NOT NULL,
  "ativacoesValor" DOUBLE PRECISION NOT NULL,
  "ec" TEXT NOT NULL,
  "volumeRS" DOUBLE PRECISION NOT NULL,
  "ra" BOOLEAN NOT NULL,
  "cesta" TEXT NOT NULL,
  "instalaDireto" BOOLEAN NOT NULL,
  "nomeGerentePJ" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Credenciamento_pkey" PRIMARY KEY ("id")
);

-- Criar tabela CnpjSimulado
CREATE TABLE IF NOT EXISTS "CnpjSimulado" (
  "id" TEXT NOT NULL,
  "fechamentoId" TEXT NOT NULL,
  "cnpj" TEXT NOT NULL,
  "nomeEmpresa" TEXT NOT NULL,
  "faturamento" DOUBLE PRECISION NOT NULL,
  "comentarios" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CnpjSimulado_pkey" PRIMARY KEY ("id")
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS "Credenciamento_fechamentoId_idx" ON "Credenciamento"("fechamentoId");
CREATE INDEX IF NOT EXISTS "CnpjSimulado_fechamentoId_idx" ON "CnpjSimulado"("fechamentoId");

-- Criar foreign keys (chaves estrangeiras)
ALTER TABLE "Credenciamento" 
  ADD CONSTRAINT "Credenciamento_fechamentoId_fkey" 
  FOREIGN KEY ("fechamentoId") 
  REFERENCES "Fechamento"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE "CnpjSimulado" 
  ADD CONSTRAINT "CnpjSimulado_fechamentoId_fkey" 
  FOREIGN KEY ("fechamentoId") 
  REFERENCES "Fechamento"("id") 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- Mensagem de sucesso
SELECT 'Tabelas criadas com sucesso!' as status;

