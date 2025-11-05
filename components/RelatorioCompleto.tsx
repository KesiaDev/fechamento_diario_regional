'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, TrendingUp, Users, Award, Target, CheckCircle, XCircle, Download } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { gerarExcelRelatorioCompleto, ExcelDataCompleto } from '@/lib/excel-generator'
import { QuadroKesiaNandi } from '@/components/QuadroKesiaNandi'

interface RelatorioDiario {
  data: string
  dataISO: string
  resumo: {
    totalGNs: number
    gnsBateramMetaCredenciamentos: number
    gnsBateramMetaVisitas: number
    percentualMetaCredenciamentos: number
    percentualMetaVisitas: number
  }
  totaisGerais: {
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
  }
  dadosPorGN: Array<{
    executivo: string
    agencia: string
    qtdVisitas: number
    qtdInteracoes: number
    qtdBraExpre: number
    totalCredenciamentos: number
    totalAtivacoes: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
    bateuMetaCredenciamentos: boolean
    bateuMetaVisitas: boolean
    percentualVisitas: number
    credenciamentos?: Array<{
      id: string
      ec: string
      volumeRS: number
      ra: boolean
      cesta: string
      instalaDireto: boolean
      nomeGerentePJ: string | null
    }>
    cnpjsSimulados?: Array<{
      id: string
      cnpj: string
      nomeEmpresa: string
      faturamento: number
      comentarios: string | null
      agenciaSimulacao?: string | null
      pjIndicou?: string | null
    }>
  }>
  metas: {
    credenciamentosPorDia: number
    visitasPorDia: number
    totalGNs: number
  }
}

interface RelatorioSemanal {
  periodo: string
  dataInicio: string
  dataFim: string
  resumo: {
    totalGNs: number
    gnsBateramMetaCredenciamentos: number
    gnsBateramMetaVisitas: number
    percentualMetaCredenciamentos: number
    percentualMetaVisitas: number
  }
  totaisGerais: {
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
  }
  dadosPorGN: Array<{
    executivo: string
    diasTrabalhados: number
    diasEsperados: number
    percentualPresenca: number
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
    mediaCredenciamentosPorDia: number
    mediaVisitasPorDia: number
    bateuMetaCredenciamentos: boolean
    bateuMetaVisitas: boolean
    fechamentos?: Array<{
      id: string
      data: string
      agencia: string
      qtdVisitas: number
      qtdInteracoes: number
      qtdBraExpre: number
      credenciamentos: Array<{
        id: string
        ec: string
        volumeRS: number
        ra: boolean
        cesta: string
        instalaDireto: boolean
        nomeGerentePJ: string | null
      }>
      cnpjsSimulados: Array<{
        id: string
        cnpj: string
        nomeEmpresa: string
        faturamento: number
        comentarios: string | null
      }>
    }>
    acumuloPorDia: Array<{
      dia: string
      diaSemana: string
      credenciamentosAcumulados: number
      ativacoesAcumuladas: number
      visitasAcumuladas: number
      interacoesAcumuladas: number
      braExpreAcumulado: number
    }>
  }>
  dadosPorDia: Array<{
    data: string
    diaSemana: string
    totalGNs: number
    totalCredenciamentos: number
    totalVisitas: number
  }>
  metas: {
    credenciamentosPorSemana: number
    visitasPorSemana: number
    totalGNs: number
  }
}

interface RelatorioMensal {
  mes: string
  ano: number
  dataInicio: string
  dataFim: string
  resumo: {
    totalGNs: number
    gnsComDados?: number
    gnsBateramMetaCredenciamentos: number
    gnsBateramMetaVisitas: number
    percentualMetaCredenciamentos: number
    percentualMetaVisitas: number
  }
  totaisGerais: {
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
  }
  dadosPorGN: Array<{
    executivo: string
    diasTrabalhados: number
    diasUteisEsperados: number
    percentualPresenca: number
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
    mediaCredenciamentosPorDia: number
    mediaVisitasPorDia: number
    bateuMetaCredenciamentos: boolean
    bateuMetaVisitas: boolean
  }>
  dadosPorSemana: Array<{
    semana: string
    totalGNs: number
    totalCredenciamentos: number
    totalVisitas: number
  }>
  ranking: Array<{
    executivo: string
    totalCredenciamentos: number
    totalAtivacoes: number
    diasTrabalhados: number
  }>
  metas: {
    credenciamentosPorMes: number
    visitasPorMes: number
    totalGNs: number
  }
}


interface RelatorioCompletoProps {
  gerenteEstadual?: string
}

export function RelatorioCompleto({ gerenteEstadual = '' }: RelatorioCompletoProps) {
  const [relatorioDiario, setRelatorioDiario] = useState<RelatorioDiario | null>(null)
  const [relatorioSemanal, setRelatorioSemanal] = useState<RelatorioSemanal | null>(null)
  const [relatorioMensal, setRelatorioMensal] = useState<RelatorioMensal | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])

  const carregarRelatorios = async () => {
    setLoading(true)
    try {
      const gerenteParam = gerenteEstadual ? `&gerenteEstadual=${encodeURIComponent(gerenteEstadual)}` : ''
      
      // Carregar relatório diário - sem acumulado para mostrar apenas o dia selecionado
      const responseDiario = await fetch(`/api/relatorios/diario?data=${dataSelecionada}&acumulado=false${gerenteParam}`)
      if (responseDiario.ok) {
        const diario = await responseDiario.json()
        // Garantir que dadosPorGN seja sempre um array
        if (diario && !Array.isArray(diario.dadosPorGN)) {
          diario.dadosPorGN = []
        }
        setRelatorioDiario(diario)
      }

      // Carregar relatório semanal
      const responseSemanal = await fetch(`/api/relatorios/semanal?data=${dataSelecionada}${gerenteParam}`)
      if (responseSemanal.ok) {
        const semanal = await responseSemanal.json()
        // Garantir que dadosPorGN seja sempre um array
        if (semanal && !Array.isArray(semanal.dadosPorGN)) {
          semanal.dadosPorGN = []
        }
        setRelatorioSemanal(semanal)
      }

      // Carregar relatório mensal
      const responseMensal = await fetch(`/api/relatorios/mensal?data=${dataSelecionada}${gerenteParam}`)
      if (responseMensal.ok) {
        const mensal = await responseMensal.json()
        // Garantir que dadosPorGN seja sempre um array
        if (mensal && !Array.isArray(mensal.dadosPorGN)) {
          mensal.dadosPorGN = []
        }
        setRelatorioMensal(mensal)
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarRelatorios()
  }, [dataSelecionada, gerenteEstadual])

  const exportarExcelCompleto = async (tipo: 'diario' | 'semanal' | 'mensal') => {
    try {
      let data: ExcelDataCompleto | null = null

      if (tipo === 'diario' && relatorioDiario) {
        const dataDiario = new Date(relatorioDiario.dataISO)
        const diaSemana = dataDiario.toLocaleDateString('pt-BR', { weekday: 'long' })

        data = {
          titulo: 'Relatório Diário',
          tipoRelatorio: 'diario',
          periodo: relatorioDiario.data,
          totaisGerais: relatorioDiario.totaisGerais,
          dadosPorGN: relatorioDiario.dadosPorGN.map(gn => {
            const credenciamentos = (gn.credenciamentos || []).map(c => ({
              ec: c.ec,
              volumeRS: c.volumeRS,
              ra: c.ra,
              cesta: c.cesta,
              instalaDireto: c.instalaDireto,
              nomeGerentePJ: c.nomeGerentePJ || '-',
              horarioCredenciamento: dataDiario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }))

            const cnpjsSimulados = (gn.cnpjsSimulados || []).map(c => ({
              cnpj: c.cnpj,
              nomeEmpresa: c.nomeEmpresa,
              faturamento: c.faturamento,
              comentarios: c.comentarios || '-',
              agenciaSimulacao: (c as any).agenciaSimulacao || '-',
              pjIndicou: (c as any).pjIndicou || '-',
              horarioSimulacao: dataDiario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }))

            // Calcular gerentes PJ envolvidos
            const gerentesPJ = new Set<string>()
            credenciamentos.forEach(c => {
              if (c.nomeGerentePJ && c.nomeGerentePJ !== '-') {
                gerentesPJ.add(c.nomeGerentePJ)
              }
            })

            return {
              executivo: gn.executivo,
              agencia: gn.agencia,
              diasTrabalhados: 1,
              diasEsperados: 1,
              percentualPresenca: 100,
              totalCredenciamentos: gn.totalCredenciamentos,
              totalAtivacoes: gn.totalAtivacoes,
              totalVisitas: gn.qtdVisitas,
              totalInteracoes: gn.qtdInteracoes,
              totalBraExpre: gn.qtdBraExpre,
              totalCnpjsSimulados: gn.totalCnpjsSimulados,
              totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
              mediaCredenciamentosPorDia: gn.totalCredenciamentos,
              mediaVisitasPorDia: gn.qtdVisitas,
              bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
              bateuMetaVisitas: gn.bateuMetaVisitas,
              detalhamentoPorDia: [{
                data: dataDiario.toISOString(),
                diaSemana,
                agencia: gn.agencia,
                qtdVisitas: gn.qtdVisitas,
                qtdInteracoes: gn.qtdInteracoes,
                qtdBraExpre: gn.qtdBraExpre,
                credenciamentos,
                cnpjsSimulados,
                resumoDia: {
                  totalCredenciamentos: credenciamentos.length,
                  totalVolume: credenciamentos.reduce((sum, c) => sum + c.volumeRS, 0),
                  totalSimulacoes: cnpjsSimulados.length,
                  totalFaturamentoSimulado: cnpjsSimulados.reduce((sum, c) => sum + c.faturamento, 0)
                }
              }],
              resumoSemanal: {
                diasComCredenciamentos: credenciamentos.length > 0 ? 1 : 0,
                diasComSimulacoes: cnpjsSimulados.length > 0 ? 1 : 0,
                gerentesPJEnvolvidos: Array.from(gerentesPJ)
              }
            }
          })
        }
      } else if (tipo === 'semanal' && relatorioSemanal) {
        // Criar mapa de datas para os dias da semana
        const startDate = new Date(relatorioSemanal.dataInicio)
        const endDate = new Date(relatorioSemanal.dataFim)
        const diasSemana: Array<{ iso: string; formatado: string }> = []
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const diaISO = d.toISOString().split('T')[0]
          const diaFormatado = d.toLocaleDateString('pt-BR', { weekday: 'long' })
          const diaNum = d.getDay()
          if (diaNum >= 1 && diaNum <= 5) { // Apenas dias úteis
            diasSemana.push({ iso: diaISO, formatado: diaFormatado })
          }
        }

        data = {
          titulo: 'Relatório Semanal',
          tipoRelatorio: 'semanal',
          periodo: relatorioSemanal.periodo,
          totaisGerais: relatorioSemanal.totaisGerais,
          dadosPorGN: relatorioSemanal.dadosPorGN.map(gn => {
            // Agrupar fechamentos por dia
            type FechamentoCompleto = NonNullable<typeof gn.fechamentos>[0]
            const fechamentosPorDia = new Map<string, FechamentoCompleto[]>()
            
            if (gn.fechamentos) {
              gn.fechamentos.forEach(fechamento => {
                const dataISO = new Date(fechamento.data).toISOString().split('T')[0]
                if (!fechamentosPorDia.has(dataISO)) {
                  fechamentosPorDia.set(dataISO, [])
                }
                fechamentosPorDia.get(dataISO)!.push(fechamento)
              })
            }

            // Criar detalhamento por dia
            const detalhamentoPorDia = diasSemana.map(({ iso, formatado }) => {
              const fechamentosDia = fechamentosPorDia.get(iso) || []
              
              const credenciamentos = fechamentosDia.flatMap(f => 
                f.credenciamentos.map(c => ({
                  ec: c.ec,
                  volumeRS: c.volumeRS,
                  ra: c.ra,
                  cesta: c.cesta,
                  instalaDireto: c.instalaDireto,
                  nomeGerentePJ: c.nomeGerentePJ || '-',
                  horarioCredenciamento: new Date(f.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                }))
              )

              const cnpjsSimulados = fechamentosDia.flatMap(f =>
                f.cnpjsSimulados.map(c => ({
                  cnpj: c.cnpj,
                  nomeEmpresa: c.nomeEmpresa,
                  faturamento: c.faturamento,
                  comentarios: c.comentarios || '-',
                  agenciaSimulacao: (c as any).agenciaSimulacao || '-',
                  pjIndicou: (c as any).pjIndicou || '-',
                  horarioSimulacao: new Date(f.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                }))
              )

              const totalCreds = credenciamentos.length
              const totalVolume = credenciamentos.reduce((sum, c) => sum + c.volumeRS, 0)
              const totalSimulacoes = cnpjsSimulados.length
              const totalFaturamento = cnpjsSimulados.reduce((sum, c) => sum + c.faturamento, 0)
              const totalVisitas = fechamentosDia.reduce((sum, f) => sum + f.qtdVisitas, 0)
              const totalInteracoes = fechamentosDia.reduce((sum, f) => sum + f.qtdInteracoes, 0)
              const totalBraExpre = fechamentosDia.reduce((sum, f) => sum + f.qtdBraExpre, 0)
              const agencia = fechamentosDia[0]?.agencia || ''

              return {
                data: new Date(iso).toISOString(),
                diaSemana: formatado,
                agencia,
                qtdVisitas: totalVisitas,
                qtdInteracoes: totalInteracoes,
                qtdBraExpre: totalBraExpre,
                credenciamentos,
                cnpjsSimulados,
                resumoDia: {
                  totalCredenciamentos: totalCreds,
                  totalVolume,
                  totalSimulacoes,
                  totalFaturamentoSimulado: totalFaturamento
                }
              }
            })

            // Calcular gerentes PJ envolvidos
            const gerentesPJ = new Set<string>()
            if (gn.fechamentos) {
              gn.fechamentos.forEach(f => {
                f.credenciamentos.forEach(c => {
                  if (c.nomeGerentePJ && c.nomeGerentePJ !== '-') {
                    gerentesPJ.add(c.nomeGerentePJ)
                  }
                })
              })
            }

            const diasComCredenciamentos = detalhamentoPorDia.filter(d => d.resumoDia.totalCredenciamentos > 0).length
            const diasComSimulacoes = detalhamentoPorDia.filter(d => d.resumoDia.totalSimulacoes > 0).length

            return {
              executivo: gn.executivo,
              agencia: gn.fechamentos?.[0]?.agencia || '',
              diasTrabalhados: gn.diasTrabalhados,
              diasEsperados: gn.diasEsperados,
              percentualPresenca: gn.percentualPresenca,
              totalCredenciamentos: gn.totalCredenciamentos,
              totalAtivacoes: gn.totalAtivacoes,
              totalVisitas: gn.totalVisitas,
              totalInteracoes: gn.totalInteracoes,
              totalBraExpre: gn.totalBraExpre,
              totalCnpjsSimulados: gn.totalCnpjsSimulados,
              totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
              mediaCredenciamentosPorDia: gn.mediaCredenciamentosPorDia,
              mediaVisitasPorDia: gn.mediaVisitasPorDia,
              bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
              bateuMetaVisitas: gn.bateuMetaVisitas,
              detalhamentoPorDia,
              resumoSemanal: {
                diasComCredenciamentos,
                diasComSimulacoes,
                gerentesPJEnvolvidos: Array.from(gerentesPJ)
              }
            }
          })
        }
      } else if (tipo === 'mensal' && relatorioMensal) {
        data = {
          titulo: 'Relatório Mensal',
          tipoRelatorio: 'mensal',
          periodo: `${relatorioMensal.mes} ${relatorioMensal.ano}`,
          totaisGerais: relatorioMensal.totaisGerais,
          dadosPorGN: relatorioMensal.dadosPorGN.map(gn => ({
            executivo: gn.executivo,
            agencia: '', // Não disponível no mensal
            diasTrabalhados: gn.diasTrabalhados,
            diasEsperados: gn.diasUteisEsperados,
            percentualPresenca: gn.percentualPresenca,
            totalCredenciamentos: gn.totalCredenciamentos,
            totalAtivacoes: gn.totalAtivacoes,
            totalVisitas: gn.totalVisitas,
            totalInteracoes: gn.totalInteracoes,
            totalBraExpre: gn.totalBraExpre,
            totalCnpjsSimulados: gn.totalCnpjsSimulados,
            totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
            mediaCredenciamentosPorDia: gn.mediaCredenciamentosPorDia,
            mediaVisitasPorDia: gn.mediaVisitasPorDia,
            bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
            bateuMetaVisitas: gn.bateuMetaVisitas,
            detalhamentoPorDia: [],
            resumoSemanal: {
              diasComCredenciamentos: gn.diasTrabalhados,
              diasComSimulacoes: 0,
              gerentesPJEnvolvidos: []
            }
          }))
        }
      }

      if (data) {
        gerarExcelRelatorioCompleto(data)
      }
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Data */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Cada mês é isolado: os dados não acumulam entre meses. Selecionando novembro, verá apenas dados de novembro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="dataSelecionada">Data de Referência</Label>
              <Input
                id="dataSelecionada"
                type="date"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                📅 Para relatório mensal: selecione qualquer data do mês desejado. Ex: Para ver novembro, selecione qualquer dia de novembro.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diario">Relatório Diário</TabsTrigger>
          <TabsTrigger value="semanal">Relatório Semanal</TabsTrigger>
          <TabsTrigger value="mensal">Relatório Mensal</TabsTrigger>
        </TabsList>

        {/* Relatório Diário */}
        <TabsContent value="diario" className="space-y-6">
          {relatorioDiario ? (
            <>
              {/* Resumo Geral */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credenciamentos</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioDiario.totaisGerais.totalCredenciamentos}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volume Total R$</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(relatorioDiario.totaisGerais.totalAtivacoes)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioDiario.totaisGerais.totalVisitas}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Interações</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioDiario.totaisGerais.totalInteracoes}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance por GN */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Diária por GN</CardTitle>
                      <CardDescription>Dados do dia {relatorioDiario.data}</CardDescription>
                    </div>
                    <Button onClick={() => exportarExcelCompleto('diario')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {relatorioDiario.dadosPorGN.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-3xl">📊</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum dado encontrado</h3>
                      <p className="text-gray-500">Não há registros de fechamento para o dia {relatorioDiario.data}.</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {relatorioDiario.dadosPorGN.map((gn, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{gn.executivo}</h4>
                            <p className="text-sm text-gray-600">{gn.agencia}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={gn.bateuMetaCredenciamentos ? "default" : "secondary"}>
                              {gn.bateuMetaCredenciamentos ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              )}
                            </Badge>
                            <Badge variant={gn.bateuMetaVisitas ? "default" : "secondary"}>
                              {gn.bateuMetaVisitas ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              )}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Credenciamentos:</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Volume R$:</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas:</p>
                            <p className="font-semibold">{gn.qtdVisitas}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações:</p>
                            <p className="font-semibold">{gn.qtdInteracoes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nenhum dado disponível para o relatório diário.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatório Semanal */}
        <TabsContent value="semanal" className="space-y-6">
          {relatorioSemanal ? (
            <>
              {/* Resumo Geral */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta Credenciamentos</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {relatorioSemanal.resumo.percentualMetaCredenciamentos}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioSemanal.resumo.gnsBateramMetaCredenciamentos} de {relatorioSemanal.resumo.totalGNs} GNs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta Visitas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {relatorioSemanal.resumo.percentualMetaVisitas}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioSemanal.resumo.gnsBateramMetaVisitas} de {relatorioSemanal.resumo.totalGNs} GNs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credenciamentos</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioSemanal.totaisGerais.totalCredenciamentos}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {relatorioSemanal.metas.credenciamentosPorSemana * relatorioSemanal.metas.totalGNs}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioSemanal.totaisGerais.totalVisitas}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {relatorioSemanal.metas.visitasPorSemana * relatorioSemanal.metas.totalGNs}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Ranking Semanal */}
              <Card>
                <CardHeader>
                  <CardTitle>Ranking Semanal</CardTitle>
                  <CardDescription>Top performers da semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatorioSemanal.dadosPorGN
                      .filter(gn => gn.totalCredenciamentos > 0)
                      .sort((a, b) => {
                        if (b.totalCredenciamentos !== a.totalCredenciamentos) {
                          return b.totalCredenciamentos - a.totalCredenciamentos
                        }
                        return b.totalAtivacoes - a.totalAtivacoes
                      })
                      .slice(0, 10)
                      .map((gn, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold">{gn.executivo}</p>
                              <p className="text-sm text-gray-600">
                                {gn.diasTrabalhados} de {gn.diasEsperados} dias ({gn.percentualPresenca}% presença)
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{gn.totalCredenciamentos} creds</p>
                            <p className="text-sm text-gray-600">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Semanal por GN */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Semanal por GN</CardTitle>
                      <CardDescription>Resumo da semana - {relatorioSemanal.periodo}</CardDescription>
                    </div>
                    <Button onClick={() => exportarExcelCompleto('semanal')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatorioSemanal.dadosPorGN.map((gn, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{gn.executivo}</h4>
                            <p className="text-sm text-gray-600">
                              {gn.diasTrabalhados} de {gn.diasEsperados} dias úteis ({gn.percentualPresenca}% presença)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={gn.bateuMetaCredenciamentos ? "default" : "secondary"}>
                              {gn.bateuMetaCredenciamentos ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              )}
                            </Badge>
                            <Badge variant={gn.bateuMetaVisitas ? "default" : "secondary"}>
                              {gn.bateuMetaVisitas ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              )}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Credenciamentos:</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaCredenciamentosPorDia.toFixed(2)}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Volume R$:</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas:</p>
                            <p className="font-semibold">{gn.totalVisitas}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaVisitasPorDia.toFixed(2)}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações:</p>
                            <p className="font-semibold">{gn.totalInteracoes}</p>
                          </div>
                        </div>

                        {/* Acúmulo Progressivo por Dia */}
                        {gn.acumuloPorDia.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-semibold mb-2">Evolução da Semana:</p>
                            <div className="grid grid-cols-5 gap-2 text-xs">
                              {gn.acumuloPorDia.map((dia, idx) => (
                                <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                                  <p className="font-semibold">{dia.dia}</p>
                                  <p className="text-gray-600">{dia.diaSemana.split(',')[0]}</p>
                                  <p className="text-green-600 font-bold mt-1">{dia.credenciamentosAcumulados}</p>
                                  <p className="text-xs text-gray-500">{formatCurrency(dia.ativacoesAcumuladas)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nenhum dado disponível para o relatório semanal.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Relatório Mensal */}
        <TabsContent value="mensal" className="space-y-6">
          {relatorioMensal ? (
            <>
              {/* Resumo Geral */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta Credenciamentos</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {relatorioMensal.resumo.percentualMetaCredenciamentos}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioMensal.resumo.gnsBateramMetaCredenciamentos} de {relatorioMensal.resumo.totalGNs} GNs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta Visitas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {relatorioMensal.resumo.percentualMetaVisitas}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioMensal.resumo.gnsBateramMetaVisitas} de {relatorioMensal.resumo.totalGNs} GNs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credenciamentos</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioMensal.totaisGerais.totalCredenciamentos}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {relatorioMensal.metas.credenciamentosPorMes * relatorioMensal.metas.totalGNs}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitas</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioMensal.totaisGerais.totalVisitas}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {relatorioMensal.metas.visitasPorMes * relatorioMensal.metas.totalGNs}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Ranking Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle>Ranking Mensal</CardTitle>
                  <CardDescription>Top performers do mês de {relatorioMensal.mes}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatorioMensal.ranking.map((gn, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{gn.executivo}</p>
                            <p className="text-sm text-gray-600">
                              {gn.diasTrabalhados} dias trabalhados
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{gn.totalCredenciamentos} creds</p>
                          <p className="text-sm text-gray-600">{formatCurrency(gn.totalAtivacoes)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance por GN */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Mensal por GN</CardTitle>
                      <CardDescription>
                        Resumo do mês de {relatorioMensal.mes} • Dados isolados (não acumulam com meses anteriores)
                      </CardDescription>
                    </div>
                    <Button onClick={() => exportarExcelCompleto('mensal')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatorioMensal.dadosPorGN.map((gn, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{gn.executivo}</h4>
                            <p className="text-sm text-gray-600">
                              {gn.diasTrabalhados} de {gn.diasUteisEsperados} dias úteis ({gn.percentualPresenca}% presença)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={gn.bateuMetaCredenciamentos ? "default" : "secondary"}>
                              {gn.bateuMetaCredenciamentos ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                              )}
                            </Badge>
                            <Badge variant={gn.bateuMetaVisitas ? "default" : "secondary"}>
                              {gn.bateuMetaVisitas ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              ) : (
                                <><XCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                              )}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Credenciamentos:</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaCredenciamentosPorDia.toFixed(2)}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Volume R$:</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bra Expre:</p>
                            <p className="font-semibold">{gn.totalBraExpre}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CNPJs Simulados:</p>
                            <p className="font-semibold">{gn.totalCnpjsSimulados}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas:</p>
                            <p className="font-semibold">{gn.totalVisitas}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaVisitasPorDia.toFixed(2)}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Faturamento Simulado:</p>
                            <p className="font-semibold">{formatCurrency(gn.totalFaturamentoSimulado)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações:</p>
                            <p className="font-semibold">{gn.totalInteracoes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nenhum dado disponível para o relatório mensal.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}