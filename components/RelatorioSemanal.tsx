'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { gerarPDFRelatorio, PDFData } from '@/lib/pdf-generator'
import { gerarExcelRelatorio, ExcelData } from '@/lib/excel-generator'
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
    } | null
    maiorVolume: {
      executivo: string
      credenciamentos: number
      ativacoes: number
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
  }>
}

export function RelatorioSemanal() {
  const [relatorio, setRelatorio] = useState<RelatorioSemanal | null>(null)
  const [loading, setLoading] = useState(false)
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0])

  const carregarRelatorio = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/fechamentos/relatorio-semanal?data=${dataFiltro}`)
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
  }, [dataFiltro])

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
      {/* Seletor de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Selecionar Semana
          </CardTitle>
          <CardDescription>
            Escolha uma data para visualizar o relatório da semana correspondente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="dataFiltroRelatorio">Data de Referência</Label>
              <Input
                id="dataFiltroRelatorio"
                type="date"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={carregarRelatorio} variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabeçalho do Relatório */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="w-6 h-6" />
                Relatório Semanal - {relatorio.periodo.semana}
              </CardTitle>
              <CardDescription className="text-blue-600">
                Período: {relatorio.periodo.inicio} a {relatorio.periodo.fim}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={gerarRelatorioPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button onClick={gerarRelatorioExcel} variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button onClick={enviarPorEmail} variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Destaques da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maior Quantidade */}
        {relatorio.destaques.maiorQuantidade && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <span className="text-2xl">🏆</span>
                Maior Quantidade da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-700 mb-2">
                  {relatorio.destaques.maiorQuantidade.executivo}
                </div>
                <div className="text-2xl font-semibold text-yellow-600">
                  {relatorio.destaques.maiorQuantidade.credenciamentos} credenciamentos
                </div>
                <div className="text-lg text-yellow-500">
                  {formatCurrency(relatorio.destaques.maiorQuantidade.ativacoes)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Maior Volume */}
        {relatorio.destaques.maiorVolume && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <span className="text-2xl">💰</span>
                Maior Volume da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {relatorio.destaques.maiorVolume.executivo}
                </div>
                <div className="text-2xl font-semibold text-green-600">
                  {formatCurrency(relatorio.destaques.maiorVolume.ativacoes)}
                </div>
                <div className="text-lg text-green-500">
                  {relatorio.destaques.maiorVolume.credenciamentos} credenciamentos
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Estatísticas Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📊 Estatísticas da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {relatorio.estatisticas.totalCredenciamentos}
              </div>
              <div className="text-sm text-gray-600">Total Credenciamentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(relatorio.estatisticas.totalAtivacoes)}
              </div>
              <div className="text-sm text-gray-600">Total Ativado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {relatorio.estatisticas.gnsComMeta}
              </div>
              <div className="text-sm text-gray-600">GNs com Meta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {relatorio.estatisticas.gnsZerados}
              </div>
              <div className="text-sm text-gray-600">GNs Zerados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Completo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🏆 Ranking Semanal Completo</CardTitle>
          <CardDescription>
            Meta semanal: {relatorio.estatisticas.metaSemanal} credenciamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relatorio.ranking.map((gn) => (
              <div
                key={gn.executivo}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  gn.posicao === 1 ? 'bg-yellow-50 border-yellow-200' :
                  gn.posicao === 2 ? 'bg-gray-50 border-gray-200' :
                  gn.posicao === 3 ? 'bg-orange-50 border-orange-200' :
                  gn.totalCredenciamentos === 0 ? 'bg-red-50 border-red-200' :
                  'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">
                    {gn.posicao === 1 ? '🥇' : gn.posicao === 2 ? '🥈' : gn.posicao === 3 ? '🥉' : `#${gn.posicao}`}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{gn.executivo}</div>
                    <div className="text-sm text-gray-600">
                      {gn.bateuMeta ? (
                        <span className="text-green-600 font-semibold">✅ Meta batida!</span>
                      ) : gn.totalCredenciamentos === 0 ? (
                        <span className="text-red-600 font-semibold">❌ Zerado</span>
                      ) : null}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {gn.totalCredenciamentos} credenciamentos
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(gn.totalAtivacoes)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {gn.diasTrabalhados} dias • Média: {gn.mediaCredenciamentos}/dia
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
