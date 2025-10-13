/**
 * Script para Limpar o Banco de Dados
 * Remove todos os dados de exemplo e deixa o sistema limpo para produção
 * 
 * Execute: npx tsx limpar-banco.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function limparBanco() {
  console.log('🧹 Limpando banco de dados...\n')

  try {
    // Limpar todos os dados
    console.log('🗑️  Removendo credenciamentos...')
    await prisma.credenciamento.deleteMany()
    
    console.log('🗑️  Removendo fechamentos...')
    await prisma.fechamento.deleteMany()
    
    console.log('✅ Banco de dados limpo!')
    console.log('🎯 Sistema pronto para uso em produção!')
    console.log('\n📝 Agora você pode:')
    console.log('   • Fazer lançamentos reais')
    console.log('   • Ver ranking com dados reais')
    console.log('   • Gerar relatórios reais')
    console.log('\n🚀 Sistema pronto para colocar no ar!')

  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

limparBanco()
