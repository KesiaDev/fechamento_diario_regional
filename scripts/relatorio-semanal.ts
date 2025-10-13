/**
 * Script para Envio Automático do Relatório Semanal
 * 
 * Este script deve ser executado toda sexta-feira após o expediente
 * para gerar e enviar o relatório semanal dos GNs
 * 
 * Execute: npx tsx scripts/relatorio-semanal.ts
 */

import { PrismaClient } from '@prisma/client'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const prisma = new PrismaClient()

async function gerarRelatorioSemanal() {
  console.log('📊 Iniciando geração do relatório semanal...\n')

  try {
    // Calcular período da semana (segunda a sexta)
    const hoje = new Date()
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }) // Segunda
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 }) // Domingo

    console.log(`📅 Período: ${format(inicioSemana, 'dd/MM/yyyy')} a ${format(fimSemana, 'dd/MM/yyyy')}`)

    // Buscar fechamentos da semana
    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: inicioSemana,
          lte: fimSemana
        }
      },
      include: {
        credenciamentos: true
      }
    })

    console.log(`📝 ${fechamentos.length} fechamentos encontrados`)

    // Agregar dados por executivo
    const rankingMap = new Map<string, {
      executivo: string
      totalCredenciamentos: number
      totalAtivacoes: number
      bateuMeta: boolean
      diasTrabalhados: number
    }>()

    fechamentos.forEach(fechamento => {
      const existing = rankingMap.get(fechamento.executivo) || {
        executivo: fechamento.executivo,
        totalCredenciamentos: 0,
        totalAtivacoes: 0,
        bateuMeta: false,
        diasTrabalhados: 0
      }

      const totalCreds = fechamento.credenciamentos.reduce(
        (sum, cred) => sum + cred.qtdCredenciamentos, 
        0
      )
      
      const totalAtiv = fechamento.credenciamentos.reduce(
        (sum, cred) => sum + cred.ativacoesValor, 
        0
      )

      existing.totalCredenciamentos += totalCreds
      existing.totalAtivacoes += totalAtiv
      existing.diasTrabalhados += 1
      
      // Meta semanal: 10 credenciamentos (2 por dia x 5 dias úteis)
      existing.bateuMeta = existing.totalCredenciamentos >= 10

      rankingMap.set(fechamento.executivo, existing)
    })

    // Converter para array e ordenar
    const ranking = Array.from(rankingMap.values())
      .sort((a, b) => {
        if (b.totalCredenciamentos !== a.totalCredenciamentos) {
          return b.totalCredenciamentos - a.totalCredenciamentos
        }
        return b.totalAtivacoes - a.totalAtivacoes
      })

    // Encontrar destaques
    const maiorQuantidade = ranking[0] || null
    const maiorVolume = ranking.reduce((max, gn) => 
      gn.totalAtivacoes > max.totalAtivacoes ? gn : max, 
      ranking[0] || { totalAtivacoes: 0 }
    )

    // Estatísticas gerais
    const totalCredenciamentos = ranking.reduce((sum, gn) => sum + gn.totalCredenciamentos, 0)
    const totalAtivacoes = ranking.reduce((sum, gn) => sum + gn.totalAtivacoes, 0)
    const gnsComMeta = ranking.filter(gn => gn.bateuMeta).length
    const gnsZerados = ranking.filter(gn => gn.totalCredenciamentos === 0).length

    // Gerar relatório em texto
    const relatorio = `
🏆 RELATÓRIO SEMANAL - CIELO
📅 ${format(hoje, "'Semana de' dd/MM/yyyy", { locale: ptBR })}
📊 Período: ${format(inicioSemana, 'dd/MM/yyyy')} a ${format(fimSemana, 'dd/MM/yyyy')}

═══════════════════════════════════════

🏆 DESTAQUES DA SEMANA:

🥇 MAIOR QUANTIDADE:
   ${maiorQuantidade ? `${maiorQuantidade.executivo} - ${maiorQuantidade.totalCredenciamentos} credenciamentos` : 'Nenhum dado'}

💰 MAIOR VOLUME:
   ${maiorVolume.totalAtivacoes > 0 ? `${maiorVolume.executivo} - R$ ${maiorVolume.totalAtivacoes.toFixed(2)}` : 'Nenhum dado'}

═══════════════════════════════════════

📊 ESTATÍSTICAS GERAIS:
   • Total de Credenciamentos: ${totalCredenciamentos}
   • Total Ativado: R$ ${totalAtivacoes.toFixed(2)}
   • GNs que bateram a meta: ${gnsComMeta}/${ranking.length}
   • GNs zerados: ${gnsZerados}
   • Meta semanal: 10 credenciamentos

═══════════════════════════════════════

🏆 RANKING COMPLETO:

${ranking.map((gn, index) => {
  const posicao = index + 1
  const medalha = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : `${posicao}º`
  const status = gn.bateuMeta ? '✅' : gn.totalCredenciamentos === 0 ? '❌' : '⚠️'
  
  return `${medalha} ${gn.executivo}
   ${status} ${gn.totalCredenciamentos} credenciamentos
   💰 R$ ${gn.totalAtivacoes.toFixed(2)}
   📅 ${gn.diasTrabalhados} dias trabalhados`
}).join('\n\n')}

═══════════════════════════════════════

📈 PRÓXIMOS PASSOS:
   • Continuar foco nos GNs abaixo da meta
   • Reconhecer os top performers
   • Acompanhar evolução semanal

💪 Parabéns a todos pelo empenho!

---
Relatório gerado automaticamente em ${format(hoje, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
Sistema de Fechamento Diário - CIELO
    `

    console.log('\n📋 RELATÓRIO GERADO:')
    console.log(relatorio)

    // Aqui você pode implementar:
    // 1. Salvar em arquivo
    // 2. Enviar por email
    // 3. Enviar por WhatsApp
    // 4. Salvar no banco de dados

    console.log('\n✅ Relatório semanal gerado com sucesso!')
    console.log('📧 Próximo passo: Implementar envio automático por email/WhatsApp')

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  gerarRelatorioSemanal()
}

export { gerarRelatorioSemanal }
