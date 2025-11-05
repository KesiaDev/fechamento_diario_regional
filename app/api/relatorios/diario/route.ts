import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, startOfDay, endOfDay, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0]
    const acumulado = searchParams.get('acumulado') === 'true'
    
    const dataReferencia = new Date(data + 'T12:00:00')
    
    let startDate: Date
    let endDate: Date
    
    if (acumulado) {
      // Para acumulado, buscar desde segunda-feira da semana
      startDate = startOfWeek(dataReferencia, { weekStartsOn: 1 }) // Segunda-feira
      endDate = endOfDay(dataReferencia) // Até o dia selecionado
    } else {
      // Para relatório diário normal, apenas o dia específico
      startDate = startOfDay(dataReferencia)
      endDate = endOfDay(dataReferencia)
    }

    // Buscar fechamentos do período (dia ou semana acumulada)
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
        { data: 'asc' },
        { executivo: 'asc' }
      ]
    })

    // Calcular totais gerais
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
    let dadosPorGN: any[]
    
    if (acumulado) {
      // Para dados acumulados, agrupar por executivo
      const gnMap = new Map<string, any>()
      
      fechamentos.forEach(fechamento => {
        const existing = gnMap.get(fechamento.executivo) || {
          executivo: fechamento.executivo,
          agencia: fechamento.agencia,
          qtdVisitas: 0,
          qtdInteracoes: 0,
          qtdBraExpre: 0,
          totalCredenciamentos: 0,
          totalAtivacoes: 0,
          totalCnpjsSimulados: 0,
          totalFaturamentoSimulado: 0,
          credenciamentos: [],
          cnpjsSimulados: []
        }
        
        const totalCreds = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.qtdCredenciamentos, 0)
        const totalAtiv = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.volumeRS, 0)
        const totalFaturamento = fechamento.cnpjsSimulados.reduce((sum, cnpj) => sum + cnpj.faturamento, 0)
        
        existing.qtdVisitas += fechamento.qtdVisitas
        existing.qtdInteracoes += fechamento.qtdInteracoes
        existing.qtdBraExpre += fechamento.qtdBraExpre
        existing.totalCredenciamentos += totalCreds
        existing.totalAtivacoes += totalAtiv
        existing.totalCnpjsSimulados += fechamento.cnpjsSimulados.length
        existing.totalFaturamentoSimulado += totalFaturamento
        existing.credenciamentos.push(...fechamento.credenciamentos)
        existing.cnpjsSimulados.push(...fechamento.cnpjsSimulados)
        
        gnMap.set(fechamento.executivo, existing)
      })
      
      dadosPorGN = Array.from(gnMap.values()).map(gn => ({
        ...gn,
        bateuMetaCredenciamentos: gn.totalCredenciamentos >= 2,
        bateuMetaVisitas: gn.qtdVisitas >= 6,
        percentualVisitas: Math.round((gn.qtdVisitas / 6) * 100)
      }))
    } else {
      // Para dados diários normais
      dadosPorGN = fechamentos.map(fechamento => {
        const totalCreds = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.qtdCredenciamentos, 0)
        const totalAtiv = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.volumeRS, 0)
        const totalFaturamento = fechamento.cnpjsSimulados.reduce((sum, cnpj) => sum + cnpj.faturamento, 0)
        
        return {
          executivo: fechamento.executivo,
          agencia: fechamento.agencia,
          qtdVisitas: fechamento.qtdVisitas,
          qtdInteracoes: fechamento.qtdInteracoes,
          qtdBraExpre: fechamento.qtdBraExpre,
          totalCredenciamentos: totalCreds,
          totalAtivacoes: totalAtiv,
          totalCnpjsSimulados: fechamento.cnpjsSimulados.length,
          totalFaturamentoSimulado: totalFaturamento,
          bateuMetaCredenciamentos: totalCreds >= 2,
          bateuMetaVisitas: fechamento.qtdVisitas >= 6,
          percentualVisitas: Math.round((fechamento.qtdVisitas / 6) * 100),
          credenciamentos: fechamento.credenciamentos,
          cnpjsSimulados: fechamento.cnpjsSimulados
        }
      })
    }
    
    // Calcular totais gerais
    dadosPorGN.forEach(gn => {
      totaisGerais.totalCredenciamentos += gn.totalCredenciamentos
      totaisGerais.totalAtivacoes += gn.totalAtivacoes
      totaisGerais.totalVisitas += gn.qtdVisitas
      totaisGerais.totalInteracoes += gn.qtdInteracoes
      totaisGerais.totalBraExpre += gn.qtdBraExpre
      totaisGerais.totalCnpjsSimulados += gn.totalCnpjsSimulados
      totaisGerais.totalFaturamentoSimulado += gn.totalFaturamentoSimulado
    })

    // Calcular métricas de performance
    const gnsComDados = dadosPorGN.length
    const gnsBateramMetaCreds = dadosPorGN.filter(gn => gn.bateuMetaCredenciamentos).length
    const gnsBateramMetaVisitas = dadosPorGN.filter(gn => gn.bateuMetaVisitas).length
    const percentualMetaCreds = gnsComDados > 0 ? Math.round((gnsBateramMetaCreds / gnsComDados) * 100) : 0
    const percentualMetaVisitas = gnsComDados > 0 ? Math.round((gnsBateramMetaVisitas / gnsComDados) * 100) : 0

    // Formatar data corretamente para exibição
    const dataFormatada = format(dataReferencia, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    
    console.log('📅 Relatório Diário - Filtro:', {
      dataSelecionada: data,
      dataReferencia: format(dataReferencia, 'dd/MM/yyyy'),
      startDate: format(startDate, 'dd/MM/yyyy HH:mm:ss'),
      endDate: format(endDate, 'dd/MM/yyyy HH:mm:ss'),
      acumulado,
      fechamentosEncontrados: fechamentos.length,
      dadosPorGN: dadosPorGN.length
    })

    // Gerar relatório estruturado
    const relatorio = {
      data: dataFormatada,
      dataISO: data,
      resumo: {
        totalGNs: gnsComDados,
        gnsBateramMetaCredenciamentos: gnsBateramMetaCreds,
        gnsBateramMetaVisitas: gnsBateramMetaVisitas,
        percentualMetaCredenciamentos: percentualMetaCreds,
        percentualMetaVisitas: percentualMetaVisitas
      },
      totaisGerais,
      dadosPorGN,
      metas: {
        credenciamentosPorDia: 2,
        visitasPorDia: 6,
        totalGNs: gnsComDados // Quantidade dinâmica de GNs com dados
      },
      geradoEm: new Date().toISOString()
    }

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório diário:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório diário' },
      { status: 500 }
    )
  }
}
