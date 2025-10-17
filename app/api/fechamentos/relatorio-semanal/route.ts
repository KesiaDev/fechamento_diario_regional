import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dataParam = searchParams.get('data')
    
    // Se não especificar data, usa a semana atual
    const dataReferencia = dataParam ? new Date(dataParam + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    // Calcular início e fim da semana (segunda a sexta)
    const inicioSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 }) // Segunda
    const fimSemana = endOfWeek(dataReferencia, { weekStartsOn: 1 }) // Domingo
    
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

    // Agregar dados por executivo
    const rankingMap = new Map<string, {
      executivo: string
      totalCredenciamentos: number
      totalAtivacoes: number
      bateuMeta: boolean
      diasTrabalhados: number
      mediaCredenciamentos: number
    }>()

    fechamentos.forEach(fechamento => {
      const existing = rankingMap.get(fechamento.executivo) || {
        executivo: fechamento.executivo,
        totalCredenciamentos: 0,
        totalAtivacoes: 0,
        bateuMeta: false,
        diasTrabalhados: 0,
        mediaCredenciamentos: 0
      }

      const totalCreds = fechamento.credenciamentos.reduce(
        (sum, cred) => sum + cred.qtdCredenciamentos, 
        0
      )
      
      const totalAtiv = fechamento.credenciamentos.reduce(
        (sum, cred) => sum + cred.volumeRS, 
        0
      )

      existing.totalCredenciamentos += totalCreds
      existing.totalAtivacoes += totalAtiv
      existing.diasTrabalhados += 1
      
      // Meta semanal: 10 credenciamentos (2 por dia x 5 dias úteis)
      existing.bateuMeta = existing.totalCredenciamentos >= 10
      existing.mediaCredenciamentos = existing.diasTrabalhados > 0 
        ? existing.totalCredenciamentos / existing.diasTrabalhados 
        : 0

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

    // Gerar relatório
    const relatorio = {
      periodo: {
        inicio: format(inicioSemana, 'dd/MM/yyyy', { locale: ptBR }),
        fim: format(fimSemana, 'dd/MM/yyyy', { locale: ptBR }),
        semana: format(dataReferencia, "'Semana de' dd/MM/yyyy", { locale: ptBR })
      },
      destaques: {
        maiorQuantidade: maiorQuantidade ? {
          executivo: maiorQuantidade.executivo,
          credenciamentos: maiorQuantidade.totalCredenciamentos,
          ativacoes: maiorQuantidade.totalAtivacoes
        } : null,
        maiorVolume: maiorVolume.totalAtivacoes > 0 ? {
          executivo: maiorVolume.executivo,
          credenciamentos: maiorVolume.totalCredenciamentos,
          ativacoes: maiorVolume.totalAtivacoes
        } : null
      },
      estatisticas: {
        totalCredenciamentos,
        totalAtivacoes,
        gnsComMeta,
        gnsZerados,
        totalGNs: ranking.length,
        metaSemanal: 10
      },
      ranking: ranking.map((gn, index) => ({
        posicao: index + 1,
        executivo: gn.executivo,
        totalCredenciamentos: gn.totalCredenciamentos,
        totalAtivacoes: gn.totalAtivacoes,
        bateuMeta: gn.bateuMeta,
        diasTrabalhados: gn.diasTrabalhados,
        mediaCredenciamentos: Math.round(gn.mediaCredenciamentos * 10) / 10
      }))
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
