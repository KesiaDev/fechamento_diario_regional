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
import { gerarPDFRelatorio, PDFData } from '@/lib/pdf-generator'
import { gerarExcelRelatorioCompleto, ExcelDataCompleto } from '@/lib/excel-generator'

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
      // Carregar relatório diário com dados acumulados
      const responseDiario = await fetch(`/api/relatorios/diario?data=${dataSelecionada}&acumulado=true`)
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

  const exportarExcelCompleto = async (tipo: 'diario' | 'semanal' | 'mensal') => {
    try {
      let dataInicio = ''
      let dataFim = ''
      
      if (tipo === 'diario' && relatorioDiario) {
        dataInicio = relatorioDiario.dataISO
        dataFim = relatorioDiario.dataISO
      } else if (tipo === 'semanal' && relatorioSemanal) {
        // Para relatório semanal, usar a data selecionada como referência
        const dataRef = new Date(dataSelecionada)
        const startOfWeek = new Date(dataRef)
        startOfWeek.setDate(dataRef.getDate() - dataRef.getDay() + 1) // Segunda-feira
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6) // Domingo
        
        dataInicio = startOfWeek.toISOString().split('T')[0]
        dataFim = endOfWeek.toISOString().split('T')[0]
      } else if (tipo === 'mensal' && relatorioMensal) {
        // Para relatório mensal, usar o mês e ano
        const dataRef = new Date(dataSelecionada)
        const startOfMonth = new Date(dataRef.getFullYear(), dataRef.getMonth(), 1)
        const endOfMonth = new Date(dataRef.getFullYear(), dataRef.getMonth() + 1, 0)
        
        dataInicio = startOfMonth.toISOString().split('T')[0]
        dataFim = endOfMonth.toISOString().split('T')[0]
      }

      if (!dataInicio || !dataFim) {
        alert('Dados não disponíveis para exportação')
        return
      }

      // Buscar dados completos da API
      const response = await fetch(`/api/relatorios/excel-completo?dataInicio=${dataInicio}&dataFim=${dataFim}&tipo=${tipo}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados completos')
      }

      const excelData: ExcelDataCompleto = await response.json()
      
      // Gerar Excel completo
      const filename = gerarExcelRelatorioCompleto(excelData)
      
      alert(`Relatório Excel completo gerado: ${filename}`)
    } catch (error) {
      console.error('Erro ao gerar Excel completo:', error)
      alert('Erro ao gerar Excel completo')
    }
  }

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
      {/* Cabeçalho Moderno */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">📈 Prestação de Resultados</h2>
            <p className="text-indigo-100">Acompanhamento completo da equipe CIELO</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200"
              aria-label="Selecionar data para relatórios"
            />
            <Button onClick={carregarRelatorios} variant="secondary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="diario" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="diario" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            📅 Diário
          </TabsTrigger>
          <TabsTrigger value="semanal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            📊 Semanal
          </TabsTrigger>
          <TabsTrigger value="mensal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            📈 Mensal
          </TabsTrigger>
        </TabsList>

        {/* Relatório Diário */}
        <TabsContent value="diario" className="space-y-6">
          {relatorioDiario && (
            <>
              {/* Resumo Executivo - Design Moderno */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{relatorioDiario.resumo.totalGNs}</div>
                      <div className="text-xs text-gray-600">Total GNs</div>
                      <div className="text-xs text-gray-500">de {relatorioDiario.metas.totalGNs} esperados</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {relatorioDiario.resumo.percentualMetaCredenciamentos}%
                      </div>
                      <div className="text-xs text-gray-600">Meta Credenciamentos</div>
                      <div className="text-xs text-gray-500">
                        {relatorioDiario.resumo.gnsBateramMetaCredenciamentos} de {relatorioDiario.resumo.totalGNs} GNs
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {relatorioDiario.resumo.percentualMetaVisitas}%
                      </div>
                      <div className="text-xs text-gray-600">Meta Visitas</div>
                      <div className="text-xs text-gray-500">
                        {relatorioDiario.resumo.gnsBateramMetaVisitas} de {relatorioDiario.resumo.totalGNs} GNs
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{relatorioDiario.totaisGerais.totalCredenciamentos}</div>
                      <div className="text-xs text-gray-600">Total Credenciamentos</div>
                      <div className="text-xs text-gray-500">
                        Meta: {relatorioDiario.metas.credenciamentosPorDia * relatorioDiario.metas.totalGNs}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acumulado Regional — Késia Nandi */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={`/fotos/Kesia.jpeg?v=${Date.now()}`}
                      alt="Késia Nandi"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        // Tenta outras extensões comuns antes de desistir
                        if (!img.dataset.tryjpg) {
                          img.dataset.tryjpg = '1'
                          img.src = '/fotos/Kesia.jpg'
                          return
                        }
                        if (!img.dataset.trypng) {
                          img.dataset.trypng = '1'
                          img.src = '/fotos/Kesia.png'
                          return
                        }
                        // Se nenhuma existir, mantém um avatar de fallback simples
                        img.style.display = 'none'
                        const parent = img.parentElement
                        if (parent) {
                          const fallback = document.createElement('div')
                          fallback.className = 'w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold'
                          fallback.textContent = 'K'
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Acumulado Regional — Késia Nandi</h3>
                      <p className="text-sm text-gray-600">Gerente Estadual • {formatDate(relatorioDiario.dataISO)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-blue-600 font-medium">Credenciamentos</p>
                    <p className="text-xl font-bold text-blue-700">{relatorioDiario.totaisGerais.totalCredenciamentos}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-green-600 font-medium">Volume R$</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(relatorioDiario.totaisGerais.totalAtivacoes)}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-purple-600 font-medium">Visitas</p>
                    <p className="text-xl font-bold text-purple-700">{relatorioDiario.totaisGerais.totalVisitas}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-orange-600 font-medium">Interações</p>
                    <p className="text-xl font-bold text-orange-700">{relatorioDiario.totaisGerais.totalInteracoes}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-600 font-medium">CNPJs Simulados</p>
                    <p className="text-xl font-bold text-gray-700">{relatorioDiario.totaisGerais.totalCnpjsSimulados}</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-pink-600 font-medium">Faturamento Simulado</p>
                    <p className="text-xl font-bold text-pink-700">{formatCurrency(relatorioDiario.totaisGerais.totalFaturamentoSimulado)}</p>
                  </div>
                </div>
              </div>

              {/* Detalhamento por GN - Design Moderno */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">👥 Performance por GN</h3>
                    <p className="text-sm text-gray-600">{relatorioDiario.data} - Detalhamento individual</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => exportarRelatorio('diario')} variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    <Button onClick={() => exportarExcelCompleto('diario')} variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200 bg-green-100">
                      <Download className="w-4 h-4 mr-2" />
                      Excel Completo
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {relatorioDiario.dadosPorGN.map((gn, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-700 font-bold text-sm">
                              {gn.executivo.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">{gn.executivo}</h4>
                            <p className="text-sm text-gray-600">{gn.agencia}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={gn.bateuMetaCredenciamentos ? "default" : "secondary"} className="text-xs">
                            {gn.bateuMetaCredenciamentos ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Meta Creds</>
                            )}
                          </Badge>
                          <Badge variant={gn.bateuMetaVisitas ? "default" : "secondary"} className="text-xs">
                            {gn.bateuMetaVisitas ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Meta Visitas</>
                            )}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 font-medium">Credenciamentos</p>
                          <p className="text-lg font-bold text-blue-700">{gn.totalCredenciamentos}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 font-medium">Volume R$</p>
                          <p className="text-lg font-bold text-green-700">{formatCurrency(gn.totalAtivacoes)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-purple-600 font-medium">Visitas</p>
                          <p className="text-lg font-bold text-purple-700">{gn.qtdVisitas}</p>
                          <p className="text-xs text-purple-500">({gn.percentualVisitas}%)</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-xs text-orange-600 font-medium">Interações</p>
                          <p className="text-lg font-bold text-orange-700">{gn.qtdInteracoes}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Bra Expre</p>
                          <p className="text-lg font-bold text-gray-700">{gn.qtdBraExpre}</p>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-xs text-indigo-600 font-medium">CNPJs Simulados</p>
                          <p className="text-lg font-bold text-indigo-700">{gn.totalCnpjsSimulados}</p>
                        </div>
                        <div className="bg-pink-50 rounded-lg p-3">
                          <p className="text-xs text-pink-600 font-medium">Faturamento Simulado</p>
                          <p className="text-lg font-bold text-pink-700">{formatCurrency(gn.totalFaturamentoSimulado)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    <div className="flex gap-2">
                      <Button onClick={() => exportarRelatorio('semanal')} variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportarExcelCompleto('semanal')} variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200 bg-green-100">
                        <Download className="w-4 h-4 mr-2" />
                        Excel Completo
                      </Button>
                    </div>
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
                            <p className="text-gray-600">Volume R$</p>
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
                    <div className="flex gap-2">
                      <Button onClick={() => exportarRelatorio('mensal')} variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportarExcelCompleto('mensal')} variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200 bg-green-100">
                        <Download className="w-4 h-4 mr-2" />
                        Excel Completo
                      </Button>
                    </div>
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
                            <p className="text-gray-600">Volume R$</p>
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
