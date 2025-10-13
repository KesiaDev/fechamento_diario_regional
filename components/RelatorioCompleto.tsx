'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, TrendingUp, Users, Award, Target, CheckCircle, XCircle, Download } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { gerarPDFRelatorio, PDFData } from '@/lib/pdf-generator'

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
  }>
  metas: {
    credenciamentosPorDia: number
    visitasPorDia: number
    totalGNs: number
  }
}

interface RelatorioSemanal {
  periodo: string
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
  }>
  metas: {
    credenciamentosPorMes: number
    visitasPorMes: number
    totalGNs: number
  }
}

export function RelatorioCompleto() {
  const [relatorioDiario, setRelatorioDiario] = useState<RelatorioDiario | null>(null)
  const [relatorioSemanal, setRelatorioSemanal] = useState<RelatorioSemanal | null>(null)
  const [relatorioMensal, setRelatorioMensal] = useState<RelatorioMensal | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0])

  const carregarRelatorios = async () => {
    setLoading(true)
    try {
      // Carregar relatório diário
      const responseDiario = await fetch(`/api/relatorios/diario?data=${dataSelecionada}`)
      if (responseDiario.ok) {
        const diario = await responseDiario.json()
        setRelatorioDiario(diario)
      }

      // Carregar relatório semanal
      const responseSemanal = await fetch(`/api/relatorios/semanal?data=${dataSelecionada}`)
      if (responseSemanal.ok) {
        const semanal = await responseSemanal.json()
        setRelatorioSemanal(semanal)
      }

      // Carregar relatório mensal
      const responseMensal = await fetch(`/api/relatorios/mensal?data=${dataSelecionada}`)
      if (responseMensal.ok) {
        const mensal = await responseMensal.json()
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
  }, [dataSelecionada])

  const exportarRelatorio = async (tipo: 'diario' | 'semanal' | 'mensal') => {
    try {
      let data: PDFData | null = null
      
      if (tipo === 'diario' && relatorioDiario) {
        data = {
          titulo: 'Relatório Diário de Performance',
          periodo: relatorioDiario.data,
          resumo: relatorioDiario.resumo,
          totaisGerais: relatorioDiario.totaisGerais,
          dadosPorGN: relatorioDiario.dadosPorGN.map(gn => ({
            executivo: gn.executivo,
            agencia: gn.agencia,
            qtdVisitas: gn.qtdVisitas,
            qtdInteracoes: gn.qtdInteracoes,
            qtdBraExpre: gn.qtdBraExpre,
            totalCredenciamentos: gn.totalCredenciamentos,
            totalAtivacoes: gn.totalAtivacoes,
            totalCnpjsSimulados: gn.totalCnpjsSimulados,
            totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
            bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
            bateuMetaVisitas: gn.bateuMetaVisitas,
            percentualVisitas: gn.percentualVisitas
          })),
          metas: {
            credenciamentosPorDia: relatorioDiario.metas.credenciamentosPorDia,
            visitasPorDia: relatorioDiario.metas.visitasPorDia,
            totalGNs: relatorioDiario.metas.totalGNs
          }
        }
      } else if (tipo === 'semanal' && relatorioSemanal) {
        data = {
          titulo: 'Relatório Semanal de Performance',
          periodo: relatorioSemanal.periodo,
          resumo: relatorioSemanal.resumo,
          totaisGerais: relatorioSemanal.totaisGerais,
          dadosPorGN: relatorioSemanal.dadosPorGN.map(gn => ({
            executivo: gn.executivo,
            totalCredenciamentos: gn.totalCredenciamentos,
            totalAtivacoes: gn.totalAtivacoes,
            totalVisitas: gn.totalVisitas,
            totalInteracoes: gn.totalInteracoes,
            totalBraExpre: gn.totalBraExpre,
            totalCnpjsSimulados: gn.totalCnpjsSimulados,
            totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
            bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
            bateuMetaVisitas: gn.bateuMetaVisitas,
            diasTrabalhados: gn.diasTrabalhados,
            diasEsperados: gn.diasEsperados,
            percentualPresenca: gn.percentualPresenca,
            mediaCredenciamentosPorDia: gn.mediaCredenciamentosPorDia,
            mediaVisitasPorDia: gn.mediaVisitasPorDia
          })),
          metas: {
            credenciamentosPorSemana: relatorioSemanal.metas.credenciamentosPorSemana,
            visitasPorSemana: relatorioSemanal.metas.visitasPorSemana,
            totalGNs: relatorioSemanal.metas.totalGNs
          }
        }
      } else if (tipo === 'mensal' && relatorioMensal) {
        data = {
          titulo: 'Relatório Mensal de Performance',
          periodo: `${relatorioMensal.mes} ${relatorioMensal.ano}`,
          resumo: relatorioMensal.resumo,
          totaisGerais: relatorioMensal.totaisGerais,
          dadosPorGN: relatorioMensal.dadosPorGN.map(gn => ({
            executivo: gn.executivo,
            totalCredenciamentos: gn.totalCredenciamentos,
            totalAtivacoes: gn.totalAtivacoes,
            totalVisitas: gn.totalVisitas,
            totalInteracoes: gn.totalInteracoes,
            totalBraExpre: gn.totalBraExpre,
            totalCnpjsSimulados: gn.totalCnpjsSimulados,
            totalFaturamentoSimulado: gn.totalFaturamentoSimulado,
            bateuMetaCredenciamentos: gn.bateuMetaCredenciamentos,
            bateuMetaVisitas: gn.bateuMetaVisitas,
            diasTrabalhados: gn.diasTrabalhados,
            diasUteisEsperados: gn.diasUteisEsperados,
            percentualPresenca: gn.percentualPresenca,
            mediaCredenciamentosPorDia: gn.mediaCredenciamentosPorDia,
            mediaVisitasPorDia: gn.mediaVisitasPorDia
          })),
          metas: {
            credenciamentosPorMes: relatorioMensal.metas.credenciamentosPorMes,
            visitasPorMes: relatorioMensal.metas.visitasPorMes,
            totalGNs: relatorioMensal.metas.totalGNs
          }
        }
      }
      
      if (data) {
        await gerarPDFRelatorio(data, tipo)
      } else {
        alert('Nenhum relatório disponível para exportação')
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
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
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prestação de Resultados</h2>
          <p className="text-gray-600">Acompanhamento completo da equipe CIELO</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <Button onClick={carregarRelatorios} variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diario">Relatório Diário</TabsTrigger>
          <TabsTrigger value="semanal">Relatório Semanal</TabsTrigger>
          <TabsTrigger value="mensal">Relatório Mensal</TabsTrigger>
        </TabsList>

        {/* Relatório Diário */}
        <TabsContent value="diario" className="space-y-6">
          {relatorioDiario && (
            <>
              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total GNs</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioDiario.resumo.totalGNs}</div>
                    <p className="text-xs text-muted-foreground">
                      de {relatorioDiario.metas.totalGNs} esperados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Meta Credenciamentos</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {relatorioDiario.resumo.percentualMetaCredenciamentos}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioDiario.resumo.gnsBateramMetaCredenciamentos} de {relatorioDiario.resumo.totalGNs} GNs
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
                      {relatorioDiario.resumo.percentualMetaVisitas}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {relatorioDiario.resumo.gnsBateramMetaVisitas} de {relatorioDiario.resumo.totalGNs} GNs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credenciamentos</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{relatorioDiario.totaisGerais.totalCredenciamentos}</div>
                    <p className="text-xs text-muted-foreground">
                      Meta: {relatorioDiario.metas.credenciamentosPorDia * relatorioDiario.metas.totalGNs}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detalhamento por GN */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance por GN - {relatorioDiario.data}</CardTitle>
                      <CardDescription>Detalhamento individual de cada Gerente de Negócios</CardDescription>
                    </div>
                    <Button onClick={() => exportarRelatorio('diario')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                            <p className="text-gray-600">Credenciamentos</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Ativações (R$)</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas</p>
                            <p className="font-semibold">{gn.qtdVisitas} ({gn.percentualVisitas}%)</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações</p>
                            <p className="font-semibold">{gn.qtdInteracoes}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bra Expre</p>
                            <p className="font-semibold">{gn.qtdBraExpre}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CNPJs Simulados</p>
                            <p className="font-semibold">{gn.totalCnpjsSimulados}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Faturamento Simulado</p>
                            <p className="font-semibold">{formatCurrency(gn.totalFaturamentoSimulado)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Relatório Semanal */}
        <TabsContent value="semanal" className="space-y-6">
          {relatorioSemanal && (
            <>
              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Período</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{relatorioSemanal.periodo}</div>
                    <p className="text-xs text-muted-foreground">Semana de trabalho</p>
                  </CardContent>
                </Card>

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
              </div>

              {/* Performance por GN */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Performance Semanal por GN</CardTitle>
                      <CardDescription>Resumo da semana de trabalho</CardDescription>
                    </div>
                    <Button onClick={() => exportarRelatorio('semanal')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
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
                              {gn.diasTrabalhados} de {gn.diasEsperados} dias ({gn.percentualPresenca}% presença)
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
                            <p className="text-gray-600">Credenciamentos</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaCredenciamentosPorDia}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Ativações (R$)</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas</p>
                            <p className="font-semibold">{gn.totalVisitas}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaVisitasPorDia}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações</p>
                            <p className="font-semibold">{gn.totalInteracoes}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bra Expre</p>
                            <p className="font-semibold">{gn.totalBraExpre}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CNPJs Simulados</p>
                            <p className="font-semibold">{gn.totalCnpjsSimulados}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Faturamento Simulado</p>
                            <p className="font-semibold">{formatCurrency(gn.totalFaturamentoSimulado)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Relatório Mensal */}
        <TabsContent value="mensal" className="space-y-6">
          {relatorioMensal && (
            <>
              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mês/Ano</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{relatorioMensal.mes}</div>
                    <p className="text-xs text-muted-foreground">Período completo</p>
                  </CardContent>
                </Card>

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
              </div>

              {/* Ranking Mensal */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Ranking Mensal</CardTitle>
                      <CardDescription>Classificação por credenciamentos e ativações</CardDescription>
                    </div>
                    <Button onClick={() => exportarRelatorio('mensal')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatorioMensal.ranking.map((gn, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{gn.executivo}</h4>
                            <p className="text-sm text-gray-600">
                              {gn.totalCredenciamentos} credenciamentos • {formatCurrency(gn.totalAtivacoes)}
                            </p>
                          </div>
                        </div>
                        {index < 3 && (
                          <Badge variant="default">
                            {index === 0 ? '🥇 1º Lugar' : 
                             index === 1 ? '🥈 2º Lugar' : '🥉 3º Lugar'}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance por GN */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Mensal por GN</CardTitle>
                  <CardDescription>Resumo completo do mês</CardDescription>
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
                            <p className="text-gray-600">Credenciamentos</p>
                            <p className="font-semibold">{gn.totalCredenciamentos}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaCredenciamentosPorDia}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Ativações (R$)</p>
                            <p className="font-semibold">{formatCurrency(gn.totalAtivacoes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Visitas</p>
                            <p className="font-semibold">{gn.totalVisitas}</p>
                            <p className="text-xs text-gray-500">Média: {gn.mediaVisitasPorDia}/dia</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Interações</p>
                            <p className="font-semibold">{gn.totalInteracoes}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bra Expre</p>
                            <p className="font-semibold">{gn.totalBraExpre}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">CNPJs Simulados</p>
                            <p className="font-semibold">{gn.totalCnpjsSimulados}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Faturamento Simulado</p>
                            <p className="font-semibold">{formatCurrency(gn.totalFaturamentoSimulado)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
