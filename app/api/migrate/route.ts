// API route temporária para adicionar as colunas no banco de produção
// Acesse: /api/migrate (GET ou POST)
// Depois de executar com sucesso, pode deletar este arquivo

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Iniciando migração: adicionando colunas agenciaSimulacao e pjIndicou...')
    
    // Adicionar coluna agenciaSimulacao
    await prisma.$executeRaw`ALTER TABLE "CnpjSimulado" ADD COLUMN IF NOT EXISTS "agenciaSimulacao" TEXT;`
    console.log('✅ Coluna agenciaSimulacao adicionada')
    
    // Adicionar coluna pjIndicou
    await prisma.$executeRaw`ALTER TABLE "CnpjSimulado" ADD COLUMN IF NOT EXISTS "pjIndicou" TEXT;`
    console.log('✅ Coluna pjIndicou adicionada')
    
    // Verificar se foram criadas
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'CnpjSimulado' 
      AND column_name IN ('agenciaSimulacao', 'pjIndicou');
    `
    
    return NextResponse.json({
      success: true,
      message: 'Colunas adicionadas com sucesso!',
      verification: result
    })
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}

