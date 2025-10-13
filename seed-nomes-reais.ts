/**
 * Script de Seed com Nomes Reais dos GNs
 * 
 * Execute: npx tsx seed-nomes-reais.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Nomes reais dos GNs
const executivos = [
  'Dionei',
  'Sheila', 
  'Renan',
  'Jeferson',
  'Jhonattan'
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
  console.log('🌱 Iniciando seed com nomes reais dos GNs...\n')

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...')
  await prisma.credenciamento.deleteMany()
  await prisma.fechamento.deleteMany()
  console.log('✅ Dados limpos!\n')

  // Criar fechamentos dos últimos 30 dias
  console.log('📊 Criando fechamentos para os GNs reais...')
  
  let totalFechamentos = 0
  let totalCredenciamentos = 0

  for (let dia = 0; dia < 30; dia++) {
    const data = getDateDaysAgo(dia)
    
    // Cada GN faz de 0 a 2 lançamentos por dia
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
            },
            cnpjsSimulados: {
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
            instalaDireto: randomBoolean(),
            nomeGerentePJ: randomBoolean() ? randomItem(['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira', 'Carlos Lima']) : null
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
            },
            cnpjsSimulados: {
              create: []
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
  console.log(`  👥 GNs: ${executivos.join(', ')}`)
  console.log(`  🏢 Agências: ${agencias.length}`)
  
  console.log('\n✅ Seed com nomes reais concluído com sucesso!')
  console.log('🎯 Agora você pode ver Dionei, Sheila, Renan, Jeferson e Jhonattan no ranking!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
