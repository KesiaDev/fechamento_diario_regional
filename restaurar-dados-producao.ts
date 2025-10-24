import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restaurarDadosProducao() {
  try {
    console.log('🔄 Restaurando dados reais no banco de produção...')
    
    // Primeiro, limpar os dados existentes
    console.log('🧹 Limpando dados existentes...')
    await prisma.credenciamento.deleteMany()
    await prisma.cnpjSimulado.deleteMany()
    await prisma.fechamento.deleteMany()
    
    console.log('✅ Dados limpos!')
    
    // Data de referência: 23/10/2025 (hoje)
    const hoje = new Date('2025-10-23T12:00:00')
    
    // DADOS DO JHONATTAN (563 - Lajeado)
    console.log('\n📊 Criando dados do Jhonattan...')
    const fechamentoJhonattan = await prisma.fechamento.create({
      data: {
        executivo: 'Jhonattan',
        agencia: '563 - Lajeado',
        qtdVisitas: 6,
        qtdInteracoes: 10,
        qtdBraExpre: 0,
        data: hoje,
        cnpjsSimulados: {
          create: [
            {
              cnpj: '15180591000284',
              nomeEmpresa: 'Empório das tintas',
              faturamento: 30000.00,
              comentarios: '-'
            },
            {
              cnpj: '63294211000102',
              nomeEmpresa: 'Kern academia',
              faturamento: 50000.00,
              comentarios: '-'
            },
            {
              cnpj: '39347233000109',
              nomeEmpresa: 'Oliveira tintas',
              faturamento: 40000.00,
              comentarios: '-'
            },
            {
              cnpj: '12483534000103',
              nomeEmpresa: 'Seria viagens',
              faturamento: 15000.00,
              comentarios: '-'
            },
            {
              cnpj: '35796939000431',
              nomeEmpresa: 'Jp celulares',
              faturamento: 30000.00,
              comentarios: '-'
            }
          ]
        }
      }
    })
    
    console.log(`✅ Jhonattan: ${fechamentoJhonattan.qtdVisitas} visitas, 5 simulações`)
    
    // DADOS DO RENAN (3275 - Ijuí)
    console.log('\n📊 Criando dados do Renan...')
    const fechamentoRenan = await prisma.fechamento.create({
      data: {
        executivo: 'Renan',
        agencia: '3275 - Ijuí',
        qtdVisitas: 9,
        qtdInteracoes: 12,
        qtdBraExpre: 0,
        data: hoje,
        credenciamentos: {
          create: [
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '1105342155',
              volumeRS: 10000.00,
              ra: true,
              cesta: 'SPRINT PJ',
              instalaDireto: true,
              nomeGerentePJ: 'MATHEUS'
            },
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '2856994665',
              volumeRS: 10000.00,
              ra: true,
              cesta: 'SPRINT PJ',
              instalaDireto: false,
              nomeGerentePJ: null
            },
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '2899900328',
              volumeRS: 10000.00,
              ra: true,
              cesta: 'SPRINT PJ',
              instalaDireto: true,
              nomeGerentePJ: null
            },
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '2814545633',
              volumeRS: 50000.00,
              ra: true,
              cesta: 'SPRINT PJ',
              instalaDireto: true,
              nomeGerentePJ: 'EDNER'
            },
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '2760051506',
              volumeRS: 10000.00,
              ra: true,
              cesta: 'SPRINT PJ',
              instalaDireto: false,
              nomeGerentePJ: 'EDNER'
            }
          ]
        }
      }
    })
    
    console.log(`✅ Renan: ${fechamentoRenan.qtdVisitas} visitas, 5 credenciamentos`)
    
    // DADOS DA SHEILA (1775 - Farroupilha)
    console.log('\n📊 Criando dados da Sheila...')
    const fechamentoSheila = await prisma.fechamento.create({
      data: {
        executivo: 'Sheila',
        agencia: '1775 - Farroupilha',
        qtdVisitas: 5,
        qtdInteracoes: 6,
        qtdBraExpre: 0,
        data: hoje,
        credenciamentos: {
          create: [
            {
              qtdCredenciamentos: 1,
              ativacoesValor: 0,
              ec: '2773727619',
              volumeRS: 10000.00,
              ra: true,
              cesta: 'Receba mais 1',
              instalaDireto: false,
              nomeGerentePJ: 'Kellen'
            }
          ]
        }
      }
    })
    
    console.log(`✅ Sheila: ${fechamentoSheila.qtdVisitas} visitas, 1 credenciamento`)
    
    console.log('\n🎉 DADOS RESTAURADOS NO BANCO DE PRODUÇÃO COM SUCESSO!')
    console.log('\n📊 RESUMO:')
    console.log('   - Jhonattan: 6 visitas, 5 simulações (R$ 165.000,00)')
    console.log('   - Renan: 9 visitas, 5 credenciamentos (R$ 90.000,00)')
    console.log('   - Sheila: 5 visitas, 1 credenciamento (R$ 10.000,00)')
    console.log('\n✅ Sistema pronto para uso em produção!')
    
  } catch (error) {
    console.error('❌ Erro ao restaurar dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restaurarDadosProducao()
