import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { format, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0]
    
    const dataReferencia = new Date(data)
    const startDate = startOfDay(dataReferencia)
    const endDate = endOfDay(dataReferencia)

    // Buscar todos os fechamentos do dia
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
      orderBy: {
        executivo: 'asc'
      }
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
    const dadosPorGN = fechamentos.map(fechamento => {
      const totalCreds = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.qtdCredenciamentos, 0)
      const totalAtiv = fechamento.credenciamentos.reduce((sum, cred) => sum + cred.volumeRS, 0)
      const totalFaturamento = fechamento.cnpjsSimulados.reduce((sum, cnpj) => sum + cnpj.faturamento, 0)
      
      // Atualizar totais gerais
      totaisGerais.totalCredenciamentos += totalCreds
      totaisGerais.totalAtivacoes += totalAtiv
      totaisGerais.totalVisitas += fechamento.qtdVisitas
      totaisGerais.totalInteracoes += fechamento.qtdInteracoes
      totaisGerais.totalBraExpre += fechamento.qtdBraExpre
      totaisGerais.totalCnpjsSimulados += fechamento.cnpjsSimulados.length
      totaisGerais.totalFaturamentoSimulado += totalFaturamento

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

    // Calcular métricas de performance
    const gnsComDados = dadosPorGN.length
    const gnsBateramMetaCreds = dadosPorGN.filter(gn => gn.bateuMetaCredenciamentos).length
    const gnsBateramMetaVisitas = dadosPorGN.filter(gn => gn.bateuMetaVisitas).length
    const percentualMetaCreds = gnsComDados > 0 ? Math.round((gnsBateramMetaCreds / gnsComDados) * 100) : 0
    const percentualMetaVisitas = gnsComDados > 0 ? Math.round((gnsBateramMetaVisitas / gnsComDados) * 100) : 0

    // Gerar relatório estruturado
    const relatorio = {
      data: format(dataReferencia, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
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
        totalGNs: 5
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
