import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataParam = searchParams.get('data')
    const gerenteEstadualParam = searchParams.get('gerenteEstadual')
    const gnsParam = searchParams.get('gns')

    const gnsFiltrados = gnsParam
      ? gnsParam
          .split(',')
          .map((gn) => gn.trim())
          .filter((gn) => gn.length > 0)
      : []

    // Se não especificar data, usa a semana atual
    const dataReferencia = dataParam ? new Date(dataParam + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    // Calcular início e fim da semana (segunda a sexta)
    const inicioSemana = startOfWeek(dataReferencia, { weekStartsOn: 1 }) // Segunda
    const fimSemana = addDays(inicioSemana, 4) // Sexta-feira (segunda + 4 dias)
    
    // Buscar fechamentos da semana
    const whereClause: Record<string, any> = {
      data: {
        gte: inicioSemana,
        lte: fimSemana
      }
    }

    if (gerenteEstadualParam && gerenteEstadualParam !== 'todas') {
      whereClause.gerenteEstadual = gerenteEstadualParam
    }

    if (gnsFiltrados.length > 0) {
      whereClause.executivo = {
        in: gnsFiltrados
      }
    }

    const fechamentos = await prisma.fechamento.findMany({
      where: whereClause,
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

    // Encontrar destaques considerando empates
    let maiorQuantidade = null
    let maiorQuantidadeEmpate: string[] = []
    let maiorVolume = null
    let maiorVolumeEmpate: string[] = []

    if (ranking.length > 0) {
      const maxCreds = Math.max(...ranking.map(gn => gn.totalCredenciamentos))
      const gnsEmpatadosCreds = ranking.filter(gn => gn.totalCredenciamentos === maxCreds)
      maiorQuantidade = gnsEmpatadosCreds.length > 0 ? gnsEmpatadosCreds[0] : null
      maiorQuantidadeEmpate = gnsEmpatadosCreds.map(gn => gn.executivo)

      const maxVolume = Math.max(...ranking.map(gn => gn.totalAtivacoes))
      const gnsEmpatadosVolume = ranking.filter(gn => gn.totalAtivacoes === maxVolume)
      maiorVolume = gnsEmpatadosVolume.length > 0 ? gnsEmpatadosVolume[0] : null
      maiorVolumeEmpate = gnsEmpatadosVolume.map(gn => gn.executivo)
    }

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
          ativacoes: maiorQuantidade.totalAtivacoes,
          temEmpate: maiorQuantidadeEmpate.length > 1,
          gnsEmpatados: maiorQuantidadeEmpate
        } : null,
        maiorVolume: maiorVolume && maiorVolume.totalAtivacoes > 0 ? {
          executivo: maiorVolume.executivo,
          credenciamentos: maiorVolume.totalCredenciamentos,
          ativacoes: maiorVolume.totalAtivacoes,
          temEmpate: maiorVolumeEmpate.length > 1,
          gnsEmpatados: maiorVolumeEmpate
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
