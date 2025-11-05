-- Adicionar novos campos ao modelo CnpjSimulado
-- Execute este SQL no Railway ou no seu banco de dados PostgreSQL

ALTER TABLE "CnpjSimulado" 
ADD COLUMN IF NOT EXISTS "agenciaSimulacao" TEXT,
ADD COLUMN IF NOT EXISTS "pjIndicou" TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'CnpjSimulado' 
AND column_name IN ('agenciaSimulacao', 'pjIndicou');

