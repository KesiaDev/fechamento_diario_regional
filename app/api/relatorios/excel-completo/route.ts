import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ExcelDataCompleto } from '@/lib/excel-generator'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')
    const tipoRelatorio = searchParams.get('tipo') as 'diario' | 'semanal' | 'mensal' || 'semanal'
    const gerenteEstadual = searchParams.get('gerenteEstadual')

    let startDate: Date
    let endDate: Date
    let periodo: string

    if (tipoRelatorio === 'semanal' && dataInicio && dataFim) {
      startDate = new Date(dataInicio + 'T00:00:00')
      endDate = new Date(dataFim + 'T23:59:59')
      periodo = `${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`
    } else if (tipoRelatorio === 'diario' && dataInicio) {
      startDate = new Date(dataInicio + 'T00:00:00')
      endDate = new Date(dataInicio + 'T23:59:59')
      periodo = format(startDate, 'dd/MM/yyyy', { locale: ptBR })
    } else {
      // Semana atual por padrão
      const hoje = new Date()
      startDate = startOfWeek(hoje, { weekStartsOn: 1 }) // Segunda-feira
      endDate = endOfWeek(hoje, { weekStartsOn: 1 }) // Domingo
      periodo = `${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`
    }

    // Buscar todos os fechamentos do período
    const fechamentos = await prisma.fechamento.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate
        },
        ...(gerenteEstadual && gerenteEstadual !== 'todas' ? { gerenteEstadual } : {})
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

    // Agrupar por executivo
    const fechamentosPorExecutivo: { [key: string]: typeof fechamentos } = {}
    fechamentos.forEach(fechamento => {
      if (!fechamentosPorExecutivo[fechamento.executivo]) {
        fechamentosPorExecutivo[fechamento.executivo] = []
      }
      fechamentosPorExecutivo[fechamento.executivo].push(fechamento)
    })

    // Criar detalhamento por dia da semana
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const todosOsDias = eachDayOfInterval({ start: startDate, end: endDate })

    const dadosPorGN = Object.entries(fechamentosPorExecutivo).map(([executivo, fechamentosGN]) => {
      const totalCredenciamentos = fechamentosGN.reduce((sum, f) => sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
      const totalAtivacoes = fechamentosGN.reduce((sum, f) => sum + f.credenciamentos.reduce((s, c) => s + c.volumeRS, 0), 0)
      const totalVisitas = fechamentosGN.reduce((sum, f) => sum + f.qtdVisitas, 0)
      const totalInteracoes = fechamentosGN.reduce((sum, f) => sum + f.qtdInteracoes, 0)
      const totalBraExpre = fechamentosGN.reduce((sum, f) => sum + f.qtdBraExpre, 0)
      const totalCnpjsSimulados = fechamentosGN.reduce((sum, f) => sum + f.cnpjsSimulados.length, 0)
      const totalFaturamentoSimulado = fechamentosGN.reduce((sum, f) => sum + f.cnpjsSimulados.reduce((s, c) => s + c.faturamento, 0), 0)

      const diasTrabalhados = new Set(fechamentosGN.map(f => format(f.data, 'yyyy-MM-dd'))).size
      const diasEsperados = todosOsDias.length
      const percentualPresenca = (diasTrabalhados / diasEsperados) * 100

      const mediaCredenciamentosPorDia = diasTrabalhados > 0 ? totalCredenciamentos / diasTrabalhados : 0
      const mediaVisitasPorDia = diasTrabalhados > 0 ? totalVisitas / diasTrabalhados : 0

      // Criar detalhamento por dia
      const detalhamentoPorDia = todosOsDias.map(dia => {
        const fechamentosDoDia = fechamentosGN.filter(f => 
          format(f.data, 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd')
        )

        const totalCredsDia = fechamentosDoDia.reduce((sum, f) => sum + f.credenciamentos.reduce((s, c) => s + c.qtdCredenciamentos, 0), 0)
        const totalVolumeDia = fechamentosDoDia.reduce((sum, f) => sum + f.credenciamentos.reduce((s, c) => s + c.volumeRS, 0), 0)
        const totalSimulacoesDia = fechamentosDoDia.reduce((sum, f) => sum + f.cnpjsSimulados.length, 0)
        const totalFaturamentoDia = fechamentosDoDia.reduce((sum, f) => sum + f.cnpjsSimulados.reduce((s, c) => s + c.faturamento, 0), 0)

        return {
          data: dia.toISOString(),
          diaSemana: diasSemana[dia.getDay()],
          agencia: fechamentosDoDia[0]?.agencia || '-',
          qtdVisitas: fechamentosDoDia.reduce((sum, f) => sum + f.qtdVisitas, 0),
          qtdInteracoes: fechamentosDoDia.reduce((sum, f) => sum + f.qtdInteracoes, 0),
          qtdBraExpre: fechamentosDoDia.reduce((sum, f) => sum + f.qtdBraExpre, 0),
          credenciamentos: fechamentosDoDia.flatMap(f => 
            f.credenciamentos.map(c => ({
              ec: c.ec,
              volumeRS: c.volumeRS,
              ra: c.ra,
              cesta: c.cesta,
              instalaDireto: c.instalaDireto,
              nomeGerentePJ: c.nomeGerentePJ || '-',
              horarioCredenciamento: f.data.toLocaleTimeString('pt-BR')
            }))
          ),
          cnpjsSimulados: fechamentosDoDia.flatMap(f => 
            f.cnpjsSimulados.map(c => ({
              cnpj: c.cnpj,
              nomeEmpresa: c.nomeEmpresa,
              faturamento: c.faturamento,
              comentarios: c.comentarios || '-',
              horarioSimulacao: f.data.toLocaleTimeString('pt-BR')
            }))
          ),
          resumoDia: {
            totalCredenciamentos: totalCredsDia,
            totalVolume: totalVolumeDia,
            totalSimulacoes: totalSimulacoesDia,
            totalFaturamentoSimulado: totalFaturamentoDia
          }
        }
      })

      // Análise dos gerentes PJ
      const gerentesPJ = new Set<string>()
      fechamentosGN.forEach(f => {
        f.credenciamentos.forEach(c => {
          if (c.nomeGerentePJ && c.nomeGerentePJ !== '-') {
            gerentesPJ.add(c.nomeGerentePJ)
          }
        })
      })

      const diasComCredenciamentos = detalhamentoPorDia.filter(d => d.resumoDia.totalCredenciamentos > 0).length
      const diasComSimulacoes = detalhamentoPorDia.filter(d => d.resumoDia.totalSimulacoes > 0).length

      return {
        executivo,
        agencia: fechamentosGN[0]?.agencia || '-',
        diasTrabalhados,
        diasEsperados,
        percentualPresenca,
        totalCredenciamentos,
        totalAtivacoes,
        totalVisitas,
        totalInteracoes,
        totalBraExpre,
        totalCnpjsSimulados,
        totalFaturamentoSimulado,
        mediaCredenciamentosPorDia,
        mediaVisitasPorDia,
        bateuMetaCredenciamentos: false, // Será calculado no frontend
        bateuMetaVisitas: false, // Será calculado no frontend
        detalhamentoPorDia,
        resumoSemanal: {
          diasComCredenciamentos,
          diasComSimulacoes,
          gerentesPJEnvolvidos: Array.from(gerentesPJ)
        }
      }
    })

    // Calcular totais gerais
    const totaisGerais = {
      totalCredenciamentos: dadosPorGN.reduce((sum, gn) => sum + gn.totalCredenciamentos, 0),
      totalAtivacoes: dadosPorGN.reduce((sum, gn) => sum + gn.totalAtivacoes, 0),
      totalVisitas: dadosPorGN.reduce((sum, gn) => sum + gn.totalVisitas, 0),
      totalInteracoes: dadosPorGN.reduce((sum, gn) => sum + gn.totalInteracoes, 0),
      totalBraExpre: dadosPorGN.reduce((sum, gn) => sum + gn.totalBraExpre, 0),
      totalCnpjsSimulados: dadosPorGN.reduce((sum, gn) => sum + gn.totalCnpjsSimulados, 0),
      totalFaturamentoSimulado: dadosPorGN.reduce((sum, gn) => sum + gn.totalFaturamentoSimulado, 0)
    }

    const excelData: ExcelDataCompleto = {
      titulo: `Relatório Completo de Performance - ${tipoRelatorio.toUpperCase()}`,
      periodo,
      tipoRelatorio,
      dadosPorGN,
      totaisGerais
    }

    return NextResponse.json(excelData)

  } catch (error) {
    console.error('Erro ao gerar dados para Excel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
