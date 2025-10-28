import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filtro = searchParams.get('filtro') || 'dia'
    const dataParam = searchParams.get('data')
    const gerenteEstadual = searchParams.get('gerenteEstadual')
    
    const dataReferencia = dataParam ? new Date(dataParam + 'T12:00:00') : new Date(new Date().toISOString().split('T')[0] + 'T12:00:00')
    
    let startDate: Date
    let endDate: Date
    
    switch (filtro) {
      case 'semana':
        startDate = startOfWeek(dataReferencia, { weekStartsOn: 0 })
        endDate = endOfWeek(dataReferencia, { weekStartsOn: 0 })
        break
      case 'mes':
        startDate = startOfMonth(dataReferencia)
        endDate = endOfMonth(dataReferencia)
        break
      case 'dia':
      default:
        startDate = startOfDay(dataReferencia)
        endDate = endOfDay(dataReferencia)
        break
    }

    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        },
        ...(gerenteEstadual ? { gerenteEstadual } : {})
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
      totalVisitas: number
      totalInteracoes: number
      bateuMeta: boolean
      bateuMetaVisitas: boolean
    }>()

    fechamentos.forEach(fechamento => {
      const existing = rankingMap.get(fechamento.executivo) || {
        executivo: fechamento.executivo,
        totalCredenciamentos: 0,
        totalAtivacoes: 0,
        totalVisitas: 0,
        totalInteracoes: 0,
        bateuMeta: false,
        bateuMetaVisitas: false
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
      existing.totalVisitas += fechamento.qtdVisitas
      existing.totalInteracoes += fechamento.qtdInteracoes
      
      // Meta: 2 credenciamentos por dia, 6 visitas por dia
      const metaCreds = filtro === 'dia' ? 2 : filtro === 'semana' ? 10 : 40
      const metaVisitas = filtro === 'dia' ? 6 : filtro === 'semana' ? 30 : 120
      existing.bateuMeta = existing.totalCredenciamentos >= metaCreds
      existing.bateuMetaVisitas = existing.totalVisitas >= metaVisitas

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

    // Adicionar informações de empate e posição
    const rankingComEmpates = ranking.map((item, index) => {
      // Calcular posição real considerando empates
      let posicao = index + 1
      
      // Verificar se há empate com GNs anteriores
      for (let i = 0; i < index; i++) {
        if (ranking[i].totalCredenciamentos === item.totalCredenciamentos && 
            ranking[i].totalAtivacoes === item.totalAtivacoes) {
          posicao = i + 1
          break
        }
      }
      
      // Verificar quantos GNs estão empatados nesta posição
      const gnsEmpatados = ranking.filter(gn => 
        gn.totalCredenciamentos === item.totalCredenciamentos && 
        gn.totalAtivacoes === item.totalAtivacoes
      )
      
      return {
        ...item,
        posicao,
        temEmpate: gnsEmpatados.length > 1,
        gnsEmpatados: gnsEmpatados.map(gn => gn.executivo)
      }
    })

    return NextResponse.json(rankingComEmpates)
  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ranking' },
      { status: 500 }
    )
  }
}

