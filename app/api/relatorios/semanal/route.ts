import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, endOfDay, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0]
    
    const dataReferencia = new Date(data + 'T12:00:00')
    const startDate = startOfWeek(dataReferencia, { weekStartsOn: 1 }) // Segunda-feira
    const endDate = addDays(startDate, 4) // Sexta-feira (segunda + 4 dias)

    // Buscar todos os fechamentos da semana
    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'asc' }
      ]
    })

    // Lista de GNs esperados
    const gnsEsperados = ['Dionei', 'Sheila', 'Renan', 'Jeferson', 'Jhonattan', 'Cristian']
    
    // Calcular totais gerais da semana
    const totaisGerais = {
      totalCredenciamentos: 0,
      totalAtivacoes: 0,
      totalVisitas: 0,
      totalInteracoes: 0,
      totalBraExpre: 0,
      totalCnpjsSimulados: 0,
      totalFaturamentoSimulado: 0
    }

    // Processar dados por GN
    const dadosPorGN = gnsEsperados.map(gn => {
      const fechamentosGN = fechamentos.filter(f => f.executivo === gn)
      
      const totalCreds = fechamentosGN.reduce((sum, f) => 
        sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
      const totalAtiv = fechamentosGN.reduce((sum, f) => 
        sum + f.credenciamentos.reduce((s, c) => s + c.volumeRS, 0), 0)
      const totalVisitas = fechamentosGN.reduce((sum, f) => sum + f.qtdVisitas, 0)
      const totalInteracoes = fechamentosGN.reduce((sum, f) => sum + f.qtdInteracoes, 0)
      const totalBraExpre = fechamentosGN.reduce((sum, f) => sum + f.qtdBraExpre, 0)
      const totalCnpjs = fechamentosGN.reduce((sum, f) => sum + f.cnpjsSimulados.length, 0)
      const totalFaturamento = fechamentosGN.reduce((sum, f) => 
        sum + f.cnpjsSimulados.reduce((s, c) => s + c.faturamento, 0), 0)

      // Atualizar totais gerais
      totaisGerais.totalCredenciamentos += totalCreds
      totaisGerais.totalAtivacoes += totalAtiv
      totaisGerais.totalVisitas += totalVisitas
      totaisGerais.totalInteracoes += totalInteracoes
      totaisGerais.totalBraExpre += totalBraExpre
      totaisGerais.totalCnpjsSimulados += totalCnpjs
      totaisGerais.totalFaturamentoSimulado += totalFaturamento

      // Calcular dias trabalhados
      const diasTrabalhados = fechamentosGN.length
      const diasEsperados = 5 // Segunda a sexta
      
      // Calcular médias
      const mediaCredenciamentosPorDia = diasTrabalhados > 0 ? totalCreds / diasTrabalhados : 0
      const mediaVisitasPorDia = diasTrabalhados > 0 ? totalVisitas / diasTrabalhados : 0

      return {
        executivo: gn,
        diasTrabalhados,
        diasEsperados,
        percentualPresenca: Math.round((diasTrabalhados / diasEsperados) * 100),
        totalCredenciamentos: totalCreds,
        totalAtivacoes: totalAtiv,
        totalVisitas,
        totalInteracoes,
        totalBraExpre,
        totalCnpjsSimulados: totalCnpjs,
        totalFaturamentoSimulado: totalFaturamento,
        mediaCredenciamentosPorDia: Math.round(mediaCredenciamentosPorDia * 100) / 100,
        mediaVisitasPorDia: Math.round(mediaVisitasPorDia * 100) / 100,
        bateuMetaCredenciamentos: totalCreds >= 10, // Meta individual: 10 credenciamentos/semana
        bateuMetaVisitas: totalVisitas >= 30, // Meta individual: 30 visitas/semana
        fechamentos: fechamentosGN,
        acumuloPorDia: (() => {
          // Calcular acúmulo progressivo por dia da semana (Segunda a Sexta)
          const diasSemana = eachDayOfInterval({ start: startDate, end: endDate })
          // Filtrar apenas dias úteis (Segunda a Sexta)
          const diasUteis = diasSemana.filter(dia => {
            const diaSemana = dia.getDay()
            return diaSemana >= 1 && diaSemana <= 5 // 1 = Segunda, 5 = Sexta
          })
          return diasUteis.map((dia, index) => {
            const fechamentosAteHoje = fechamentosGN.filter(f => 
              f.data <= endOfDay(dia)
            )
            
            const credenciamentosAcumulados = fechamentosAteHoje.reduce((sum, f) => 
              sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
            const ativacoesAcumuladas = fechamentosAteHoje.reduce((sum, f) => 
              sum + f.credenciamentos.reduce((s, c) => s + c.volumeRS, 0), 0)
            const visitasAcumuladas = fechamentosAteHoje.reduce((sum, f) => sum + f.qtdVisitas, 0)
            const interacoesAcumuladas = fechamentosAteHoje.reduce((sum, f) => sum + f.qtdInteracoes, 0)
            const braExpreAcumulado = fechamentosAteHoje.reduce((sum, f) => sum + f.qtdBraExpre, 0)
            
            return {
              dia: format(dia, 'dd/MM', { locale: ptBR }),
              diaSemana: format(dia, 'EEEE', { locale: ptBR }),
              credenciamentosAcumulados,
              ativacoesAcumuladas,
              visitasAcumuladas,
              interacoesAcumuladas,
              braExpreAcumulado
            }
          })
        })()
      }
    })

    // Calcular métricas de performance
    const gnsComDados = dadosPorGN.filter(gn => gn.diasTrabalhados > 0).length
    const gnsBateramMetaCreds = dadosPorGN.filter(gn => gn.bateuMetaCredenciamentos).length
    const gnsBateramMetaVisitas = dadosPorGN.filter(gn => gn.bateuMetaVisitas).length
    const percentualMetaCreds = gnsComDados > 0 ? Math.round((gnsBateramMetaCreds / gnsComDados) * 100) : 0
    const percentualMetaVisitas = gnsComDados > 0 ? Math.round((gnsBateramMetaVisitas / gnsComDados) * 100) : 0

    // Dados por dia da semana (Segunda a Sexta)
    const diasDaSemana = eachDayOfInterval({ start: startDate, end: endDate })
    const diasUteis = diasDaSemana.filter(dia => {
      const diaSemana = dia.getDay()
      return diaSemana >= 1 && diaSemana <= 5 // 1 = Segunda, 5 = Sexta
    })
    const dadosPorDia = diasUteis.map(dia => {
      const fechamentosDoDia = fechamentos.filter(f => isSameDay(f.data, dia))
      const totalCredsDia = fechamentosDoDia.reduce((sum, f) => 
        sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
      const totalVisitasDia = fechamentosDoDia.reduce((sum, f) => sum + f.qtdVisitas, 0)
      
      return {
        data: format(dia, 'dd/MM'),
        diaSemana: format(dia, 'EEEE', { locale: ptBR }),
        totalGNs: fechamentosDoDia.length,
        totalCredenciamentos: totalCredsDia,
        totalVisitas: totalVisitasDia,
        fechamentos: fechamentosDoDia
      }
    })

    // Gerar relatório estruturado
    const relatorio = {
      periodo: `${format(startDate, 'dd/MM')} a ${format(endDate, 'dd/MM/yyyy')}`,
      dataInicio: startDate.toISOString(),
      dataFim: endDate.toISOString(),
      resumo: {
        totalGNs: gnsComDados,
        gnsBateramMetaCredenciamentos: gnsBateramMetaCreds,
        gnsBateramMetaVisitas: gnsBateramMetaVisitas,
        percentualMetaCredenciamentos: percentualMetaCreds,
        percentualMetaVisitas: percentualMetaVisitas
      },
      totaisGerais,
      dadosPorGN,
      dadosPorDia,
      metas: {
        credenciamentosPorSemana: 10, // 10 mínimos por semana (segunda a sexta)
        visitasPorSemana: 30, // 6 por dia x 5 dias úteis
        totalGNs: gnsComDados // Quantidade dinâmica de GNs com dados
      },
      geradoEm: new Date().toISOString()
    }

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório semanal:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório semanal' },
      { status: 500 }
    )
  }
}
