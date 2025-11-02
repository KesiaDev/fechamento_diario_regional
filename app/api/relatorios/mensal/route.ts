import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { format, startOfMonth, endOfMonth, endOfDay, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { executivos, getGNsPorGerenteEstadual } from '@/lib/agencias'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data') || new Date().toISOString().split('T')[0]
    const gerenteEstadual = searchParams.get('gerenteEstadual')
    
    // Garantir que busca apenas o mês especificado, sem acumular com meses anteriores ou posteriores
    const dataReferencia = new Date(data + 'T12:00:00')
    const startDate = startOfMonth(dataReferencia) // Primeiro dia do mês às 00:00:00
    const endDate = endOfDay(endOfMonth(dataReferencia)) // Último dia do mês às 23:59:59
    
    console.log('📅 Relatório Mensal - Filtro:', {
      dataReferencia: format(dataReferencia, 'dd/MM/yyyy'),
      startDate: format(startDate, 'dd/MM/yyyy HH:mm:ss'),
      endDate: format(endDate, 'dd/MM/yyyy HH:mm:ss'),
      mes: format(dataReferencia, 'MMMM yyyy', { locale: ptBR })
    })

    // Buscar APENAS os fechamentos do mês especificado
    // IMPORTANTE: Não acumula com meses anteriores ou posteriores
    // Cada mês é isolado: dia 01 até o último dia do mês (28, 29, 30 ou 31) às 23:59:59
    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,  // >= primeiro dia do mês às 00:00:00
          lte: endDate     // <= último dia do mês às 23:59:59
        },
        ...(gerenteEstadual && gerenteEstadual !== 'todas' ? { gerenteEstadual } : {})
      },
      include: {
        credenciamentos: true,
        cnpjsSimulados: true
      },
      orderBy: [
        { data: 'asc' }
      ]
    })
    
    console.log(`📊 Fechamentos encontrados para ${format(dataReferencia, 'MMMM yyyy', { locale: ptBR })}:`, fechamentos.length)

    // Filtrar GNs baseado no gerente estadual, se fornecido
    let gnsEsperados: string[]
    if (gerenteEstadual && gerenteEstadual !== 'todas') {
      // Obter apenas os GNs do gerente estadual selecionado
      gnsEsperados = getGNsPorGerenteEstadual(gerenteEstadual).sort()
    } else {
      // Usar a lista completa de executivos da regional
      gnsEsperados = [...executivos].sort()
    }
    
    // Calcular totais gerais do mês
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
      const diasUteisEsperados = 22 // Aproximadamente 22 dias úteis por mês
      
      // Calcular médias
      const mediaCredenciamentosPorDia = diasTrabalhados > 0 ? totalCreds / diasTrabalhados : 0
      const mediaVisitasPorDia = diasTrabalhados > 0 ? totalVisitas / diasTrabalhados : 0

      return {
        executivo: gn,
        diasTrabalhados,
        diasUteisEsperados,
        percentualPresenca: Math.round((diasTrabalhados / diasUteisEsperados) * 100),
        totalCredenciamentos: totalCreds,
        totalAtivacoes: totalAtiv,
        totalVisitas,
        totalInteracoes,
        totalBraExpre,
        totalCnpjsSimulados: totalCnpjs,
        totalFaturamentoSimulado: totalFaturamento,
        mediaCredenciamentosPorDia: Math.round(mediaCredenciamentosPorDia * 100) / 100,
        mediaVisitasPorDia: Math.round(mediaVisitasPorDia * 100) / 100,
        bateuMetaCredenciamentos: totalCreds >= 44, // 2 por dia x 22 dias úteis
        bateuMetaVisitas: totalVisitas >= 132, // 6 por dia x 22 dias úteis
        fechamentos: fechamentosGN
      }
    })

    // Calcular métricas de performance
    const totalGNsCadastrados = dadosPorGN.length // Total de GNs cadastrados na regional
    const gnsComDados = dadosPorGN.filter(gn => gn.diasTrabalhados > 0).length
    const gnsBateramMetaCreds = dadosPorGN.filter(gn => gn.bateuMetaCredenciamentos).length
    const gnsBateramMetaVisitas = dadosPorGN.filter(gn => gn.bateuMetaVisitas).length
    const percentualMetaCreds = gnsComDados > 0 ? Math.round((gnsBateramMetaCreds / gnsComDados) * 100) : 0
    const percentualMetaVisitas = gnsComDados > 0 ? Math.round((gnsBateramMetaVisitas / gnsComDados) * 100) : 0

    // Dados por semana do mês
    const semanasDoMes = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
    const dadosPorSemana = semanasDoMes.map(semana => {
      const inicioSemana = startOfWeek(semana, { weekStartsOn: 1 })
      const fimSemana = endOfWeek(semana, { weekStartsOn: 1 })
      
      const fechamentosSemana = fechamentos.filter(f => 
        f.data >= inicioSemana && f.data <= fimSemana)
      
      const totalCredsSemana = fechamentosSemana.reduce((sum, f) => 
        sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
      const totalVisitasSemana = fechamentosSemana.reduce((sum, f) => sum + f.qtdVisitas, 0)
      
      return {
        semana: `${format(inicioSemana, 'dd/MM')} a ${format(fimSemana, 'dd/MM')}`,
        totalGNs: fechamentosSemana.length,
        totalCredenciamentos: totalCredsSemana,
        totalVisitas: totalVisitasSemana,
        fechamentos: fechamentosSemana
      }
    })

    // Ranking dos GNs
    const ranking = dadosPorGN
      .filter(gn => gn.diasTrabalhados > 0)
      .sort((a, b) => {
        if (b.totalCredenciamentos !== a.totalCredenciamentos) {
          return b.totalCredenciamentos - a.totalCredenciamentos
        }
        return b.totalAtivacoes - a.totalAtivacoes
      })

    // Gerar relatório estruturado
    const relatorio = {
      mes: format(dataReferencia, "MMMM 'de' yyyy", { locale: ptBR }),
      ano: dataReferencia.getFullYear(),
      dataInicio: startDate.toISOString(),
      dataFim: endDate.toISOString(),
      resumo: {
        totalGNs: totalGNsCadastrados, // Total de GNs cadastrados
        gnsComDados: gnsComDados, // GNs que têm fechamentos
        gnsBateramMetaCredenciamentos: gnsBateramMetaCreds,
        gnsBateramMetaVisitas: gnsBateramMetaVisitas,
        percentualMetaCredenciamentos: percentualMetaCreds,
        percentualMetaVisitas: percentualMetaVisitas
      },
      totaisGerais,
      dadosPorGN,
      dadosPorSemana,
      ranking,
      metas: {
        credenciamentosPorMes: 44, // 2 por dia x 22 dias úteis
        visitasPorMes: 132, // 6 por dia x 22 dias úteis
        totalGNs: totalGNsCadastrados // Total de GNs cadastrados na regional
      },
      geradoEm: new Date().toISOString()
    }

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório mensal:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório mensal' },
      { status: 500 }
    )
  }
}
