'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { gerarPDFRelatorio, PDFData } from '@/lib/pdf-generator'
import { gerarExcelRelatorio, gerarExcelRelatorioCompleto, ExcelData, ExcelDataCompleto } from '@/lib/excel-generator'
import { Download, Mail, Calendar, FileSpreadsheet } from 'lucide-react'

type RelatorioSemanal = {
  periodo: {
    inicio: string
    fim: string
    semana: string
  }
  destaques: {
    maiorQuantidade: {
      executivo: string
      credenciamentos: number
      ativacoes: number
      temEmpate?: boolean
      gnsEmpatados?: string[]
    } | null
    maiorVolume: {
      executivo: string
      credenciamentos: number
      ativacoes: number
      temEmpate?: boolean
      gnsEmpatados?: string[]
    } | null
  }
  estatisticas: {
    totalCredenciamentos: number
    totalAtivacoes: number
    gnsComMeta: number
    gnsZerados: number
    totalGNs: number
    metaSemanal: number
  }
  ranking: Array<{
    posicao: number
    executivo: string
    totalCredenciamentos: number
    totalAtivacoes: number
    bateuMeta: boolean
    diasTrabalhados: number
    mediaCredenciamentos: number
    acumuloPorDia?: Array<{
      dia: string
      diaSemana: string
      credenciamentosAcumulados: number
      ativacoesAcumuladas: number
      visitasAcumuladas: number
      interacoesAcumuladas: number
      braExpreAcumulado: number
    }>
  }>
}

interface RelatorioSemanalProps {
  gerenteEstadual?: string
}

export function RelatorioSemanal({ gerenteEstadual = '' }: RelatorioSemanalProps) {
  const [relatorio, setRelatorio] = useState<RelatorioSemanal | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0])

  const carregarRelatorio = async () => {
    setLoading(true)
    try {
      const url = `/api/fechamentos/relatorio-semanal?data=${dataFiltro}${gerenteEstadual && gerenteEstadual !== 'todas' ? `&gerenteEstadual=${encodeURIComponent(gerenteEstadual)}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setRelatorio(data)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarRelatorio()
  }, [dataFiltro, gerenteEstadual])

  const gerarRelatorioPDF = async () => {
    if (!relatorio) return

    try {
      const pdfData: PDFData = {
        titulo: 'Relatório Semanal de Performance - CIELO',
        periodo: `${relatorio.periodo.inicio} a ${relatorio.periodo.fim}`,
        resumo: {
          totalGNs: relatorio.estatisticas.totalGNs,
          gnsBateramMetaCredenciamentos: relatorio.estatisticas.gnsComMeta,
          gnsBateramMetaVisitas: 0, // Será calculado
          percentualMetaCredenciamentos: 0, // Será calculado
          percentualMetaVisitas: 0 // Será calculado
        },
        totaisGerais: {
          totalCredenciamentos: relatorio.estatisticas.totalCredenciamentos,
          totalAtivacoes: relatorio.estatisticas.totalAtivacoes,
          totalVisitas: 0,
          totalInteracoes: 0,
          totalBraExpre: 0,
          totalCnpjsSimulados: 0,
          totalFaturamentoSimulado: 0
        },
        dadosPorGN: relatorio.ranking.map(gn => ({
          executivo: gn.executivo,
          diasTrabalhados: gn.diasTrabalhados,
          diasEsperados: 5,
          percentualPresenca: Math.round((gn.diasTrabalhados / 5) * 100),
          totalCredenciamentos: gn.totalCredenciamentos,
          totalAtivacoes: gn.totalAtivacoes,
          totalVisitas: 0,
          totalInteracoes: 0,
          totalBraExpre: 0,
          totalCnpjsSimulados: 0,
          totalFaturamentoSimulado: 0,
          mediaCredenciamentosPorDia: gn.mediaCredenciamentos,
          mediaVisitasPorDia: 0,
          bateuMetaCredenciamentos: gn.bateuMeta,
          bateuMetaVisitas: false
        })),
        metas: {
          credenciamentosPorSemana: 10,
          visitasPorSemana: 30,
          totalGNs: relatorio.estatisticas.totalGNs
        }
      }

      await gerarPDFRelatorio(pdfData, 'semanal')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF')
    }
  }

  const gerarRelatorioExcel = async () => {
    if (!relatorio) return

    try {
      const excelData: ExcelData = {
        titulo: 'Relatório Semanal de Performance - CIELO',
        periodo: `${relatorio.periodo.inicio} a ${relatorio.periodo.fim}`,
        dadosPorGN: relatorio.ranking.map(gn => ({
          executivo: gn.executivo,
          diasTrabalhados: gn.diasTrabalhados,
          diasEsperados: 5,
          percentualPresenca: Math.round((gn.diasTrabalhados / 5) * 100),
          totalCredenciamentos: gn.totalCredenciamentos,
          totalAtivacoes: gn.totalAtivacoes,
          totalVisitas: 0,
          totalInteracoes: 0,
          totalBraExpre: 0,
          totalCnpjsSimulados: 0,
          totalFaturamentoSimulado: 0,
          mediaCredenciamentosPorDia: gn.mediaCredenciamentos,
          mediaVisitasPorDia: 0,
          bateuMetaCredenciamentos: gn.bateuMeta,
          bateuMetaVisitas: false,
          fechamentos: [] // Será preenchido com dados detalhados
        })),
        totaisGerais: {
          totalCredenciamentos: relatorio.estatisticas.totalCredenciamentos,
          totalAtivacoes: relatorio.estatisticas.totalAtivacoes,
          totalVisitas: 0,
          totalInteracoes: 0,
          totalBraExpre: 0,
          totalCnpjsSimulados: 0,
          totalFaturamentoSimulado: 0
        }
      }

      gerarExcelRelatorio(excelData)
    } catch (error) {
      console.error('Erro ao gerar Excel:', error)
      alert('Erro ao gerar Excel')
    }
  }

  const gerarRelatorioExcelCompleto = async () => {
    if (!relatorio) return

    try {
      // Buscar dados completos da API
      const response = await fetch(`/api/relatorios/excel-completo?dataInicio=${relatorio.periodo.inicio}&dataFim=${relatorio.periodo.fim}&tipo=semanal`)
      
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

  const enviarPorEmail = () => {
    // Implementar envio por email (futuro)
    alert('Funcionalidade de email será implementada em breve!')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">Carregando relatório...</p>
        </CardContent>
      </Card>
    )
  }

  if (!relatorio) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-gray-500">Erro ao carregar relatório</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho Moderno */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 Relatório Semanal</h2>
            <p className="text-blue-100">Acompanhamento de performance da equipe CIELO</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="date"
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
            <Button onClick={carregarRelatorio} variant="secondary" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Período e Ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{relatorio.periodo.semana}</h3>
          <p className="text-sm text-gray-600">{relatorio.periodo.inicio} a {relatorio.periodo.fim}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={gerarRelatorioExcel} variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Destaques da Semana - Design Compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maior Quantidade */}
        {relatorio.destaques.maiorQuantidade && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 text-lg">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-700">Maior Quantidade</h3>
                <p className="text-xs text-yellow-600">Destaque da semana</p>
              </div>
            </div>
            {relatorio.destaques.maiorQuantidade.temEmpate ? (
              <div className="space-y-2">
                <div className="text-xs text-yellow-600 font-medium">
                  {relatorio.destaques.maiorQuantidade.gnsEmpatados?.length} GNs empatados com {relatorio.destaques.maiorQuantidade.credenciamentos} creds
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatorio.destaques.maiorQuantidade.gnsEmpatados?.map((gn, index) => (
                    <div key={gn} className="flex items-center gap-2 bg-yellow-100 rounded-lg px-2 py-1">
                      <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                        <span className="text-yellow-700 font-bold text-sm">{gn.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-medium text-yellow-700">{gn}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-700 font-bold text-lg">
                    {relatorio.destaques.maiorQuantidade.executivo.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-yellow-700">{relatorio.destaques.maiorQuantidade.executivo}</div>
                  <div className="text-sm text-yellow-600">
                    {relatorio.destaques.maiorQuantidade.credenciamentos} creds • {formatCurrency(relatorio.destaques.maiorQuantidade.ativacoes)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Maior Volume */}
        {relatorio.destaques.maiorVolume && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-green-900 text-lg">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-700">Maior Volume</h3>
                <p className="text-xs text-green-600">Destaque da semana</p>
              </div>
            </div>
            {relatorio.destaques.maiorVolume.temEmpate ? (
              <div className="space-y-2">
                <div className="text-xs text-green-600 font-medium">
                  {relatorio.destaques.maiorVolume.gnsEmpatados?.length} GNs empatados com {formatCurrency(relatorio.destaques.maiorVolume.ativacoes)}
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatorio.destaques.maiorVolume.gnsEmpatados?.map((gn, index) => (
                    <div key={gn} className="flex items-center gap-2 bg-green-100 rounded-lg px-2 py-1">
                      <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                        <span className="text-green-700 font-bold text-sm">{gn.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-medium text-green-700">{gn}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-bold text-lg">
                    {relatorio.destaques.maiorVolume.executivo.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-green-700">{relatorio.destaques.maiorVolume.executivo}</div>
                  <div className="text-sm text-green-600">
                    {formatCurrency(relatorio.destaques.maiorVolume.ativacoes)} • {relatorio.destaques.maiorVolume.credenciamentos} creds
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Estatísticas Gerais - Design Moderno */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{relatorio.estatisticas.totalCredenciamentos}</div>
              <div className="text-xs text-gray-600">Total Credenciamentos</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">💰</span>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{formatCurrency(relatorio.estatisticas.totalAtivacoes)}</div>
              <div className="text-xs text-gray-600">Total R$</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-lg">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{relatorio.estatisticas.gnsComMeta}</div>
              <div className="text-xs text-gray-600">GNs com Meta</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-lg">❌</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{relatorio.estatisticas.gnsZerados}</div>
              <div className="text-xs text-gray-600">GNs Zerados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Completo - Design Moderno */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">🏆 Ranking Semanal</h3>
            <p className="text-sm text-gray-600">Meta: {relatorio.estatisticas.metaSemanal} credenciamentos</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {relatorio.ranking.map((gn) => (
            <div
              key={gn.executivo}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${
                gn.posicao === 1 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
                gn.posicao === 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200' :
                gn.posicao === 3 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' :
                gn.totalCredenciamentos === 0 ? 'bg-red-50 border-red-200' :
                'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  gn.posicao === 1 ? 'bg-yellow-400 text-yellow-900' :
                  gn.posicao === 2 ? 'bg-gray-400 text-gray-900' :
                  gn.posicao === 3 ? 'bg-orange-400 text-orange-900' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {gn.posicao === 1 ? '🥇' : gn.posicao === 2 ? '🥈' : gn.posicao === 3 ? '🥉' : gn.posicao}
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-bold text-sm">
                    {gn.executivo.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{gn.executivo}</div>
                  <div className="flex items-center gap-2">
                    {gn.bateuMeta ? (
                      <span className="text-xs text-green-600 font-medium">✅ Meta</span>
                    ) : gn.totalCredenciamentos === 0 ? (
                      <span className="text-xs text-red-600 font-medium">❌ Zerado</span>
                    ) : null}
                    <span className="text-xs text-gray-500">
                      {gn.diasTrabalhados} dias • {gn.mediaCredenciamentos}/dia
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {gn.totalCredenciamentos}
                  <span className="text-xs text-gray-400">/{relatorio.estatisticas.metaSemanal}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(gn.totalAtivacoes)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Acúmulo Progressivo da Semana */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Acúmulo Progressivo da Semana</h3>
          <div className="space-y-4">
            {relatorio.ranking.filter(gn => gn.acumuloPorDia && gn.acumuloPorDia.length > 0).map((gn) => (
              <div key={gn.executivo} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-bold text-sm">{gn.executivo.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{gn.executivo}</h4>
                    <p className="text-sm text-gray-600">
                      Total: {gn.totalCredenciamentos} creds • {formatCurrency(gn.totalAtivacoes)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {gn.acumuloPorDia!.map((dia, diaIndex) => (
                    <div key={diaIndex} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{dia.dia}</div>
                      <div className="text-xs text-gray-400 mb-2 capitalize">{dia.diaSemana}</div>
                      <div className="bg-white p-3 rounded border hover:shadow-sm transition-shadow">
                        <div className="text-lg font-bold text-blue-600 mb-1">
                          {dia.credenciamentosAcumulados}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">creds</div>
                        <div className="text-xs text-green-600 font-medium">
                          {formatCurrency(dia.ativacoesAcumuladas)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {dia.visitasAcumuladas} visitas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
