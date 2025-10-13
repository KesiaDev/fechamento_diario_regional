/**
 * Script de Seed - Popular banco de dados com dados de teste
 * 
 * Execute: npx tsx seed.ts
 * (Instalar tsx: npm install -D tsx)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const executivos = [
  'João Silva',
  'Maria Santos',
  'Carlos Oliveira',
  'Ana Paula',
  'Pedro Costa',
  'Juliana Lima',
  'Roberto Alves',
  'Fernanda Souza'
]

const agencias = [
  'AG 001 - Centro',
  'AG 002 - Zona Sul',
  'AG 003 - Zona Norte',
  'AG 004 - Zona Oeste',
  'AG 005 - Zona Leste'
]

const cestas = [
  'Cesta completa',
  'Cesta básica',
  'Cesta premium',
  'Cesta personalizada',
  'Cesta padrão'
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

function randomBoolean(): boolean {
  return Math.random() > 0.5
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateEC(): string {
  return String(randomInt(1000000000, 9999999999))
}

function getDateDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...')
  await prisma.credenciamento.deleteMany()
  await prisma.fechamento.deleteMany()
  console.log('✅ Dados limpos!\n')

  // Criar fechamentos dos últimos 30 dias
  console.log('📊 Criando fechamentos...')
  
  let totalFechamentos = 0
  let totalCredenciamentos = 0

  for (let dia = 0; dia < 30; dia++) {
    const data = getDateDaysAgo(dia)
    
    // Cada executivo faz de 0 a 2 lançamentos por dia
    for (const executivo of executivos) {
      const fazLancamento = Math.random() > 0.3 // 70% de chance de fazer lançamento
      
      if (!fazLancamento) continue

      const qtdVisitas = randomInt(1, 10)
      const qtdBraExpre = randomInt(0, 5)
      
      // Número de credenciamentos (0 a 4)
      const numCredenciamentos = randomInt(0, 4)

      if (numCredenciamentos === 0) {
        // Criar fechamento sem credenciamentos (zerado)
        await prisma.fechamento.create({
          data: {
            executivo,
            agencia: randomItem(agencias),
            qtdVisitas,
            qtdInteracoes: randomInt(0, 10),
            qtdBraExpre,
            data,
            credenciamentos: {
              create: []
            }
          }
        })
        totalFechamentos++
      } else {
        // Criar fechamento com credenciamentos
        const credenciamentos = []
        
        for (let i = 0; i < numCredenciamentos; i++) {
          credenciamentos.push({
            qtdCredenciamentos: randomInt(1, 3),
            ativacoesValor: randomFloat(500, 5000),
            ec: generateEC(),
            volumeRS: randomFloat(1000, 10000),
            ra: randomBoolean(),
            cesta: randomItem(cestas),
            pjInstalaDireto: randomBoolean()
          })
          totalCredenciamentos++
        }

        await prisma.fechamento.create({
          data: {
            executivo,
            agencia: randomItem(agencias),
            qtdVisitas,
            qtdInteracoes: randomInt(0, 10),
            qtdBraExpre,
            data,
            credenciamentos: {
              create: credenciamentos
            }
          }
        })
        totalFechamentos++
      }
    }
  }

  console.log(`✅ ${totalFechamentos} fechamentos criados!`)
  console.log(`✅ ${totalCredenciamentos} credenciamentos criados!\n`)

  // Estatísticas
  console.log('📈 Estatísticas:')
  
  const fechamentosCount = await prisma.fechamento.count()
  const credenciamentosCount = await prisma.credenciamento.count()
  
  const fechamentosComCred = await prisma.fechamento.findMany({
    include: {
      credenciamentos: true
    }
  })

  const totalAtivacoes = fechamentosComCred.reduce((sum, f) => {
    return sum + f.credenciamentos.reduce((s, c) => s + c.ativacoesValor, 0)
  }, 0)

  console.log(`  📝 Total de fechamentos: ${fechamentosCount}`)
  console.log(`  📊 Total de credenciamentos: ${credenciamentosCount}`)
  console.log(`  💰 Total ativado: R$ ${totalAtivacoes.toFixed(2)}`)
  console.log(`  👥 Executivos: ${executivos.length}`)
  console.log(`  🏢 Agências: ${agencias.length}`)
  
  console.log('\n✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

