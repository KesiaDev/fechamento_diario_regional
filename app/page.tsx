'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2, TrendingUp, Users, Award } from 'lucide-react'
import { RelatorioSemanal } from '@/components/RelatorioSemanal'

type Credenciamento = {
  id: string
  qtdCredenciamentos: string
  ativacoesValor: string
  ec: string
  volumeRS: string
  ra: string
  cesta: string
  pjInstalaDireto: string
}

type Fechamento = {
  id: string
  executivo: string
  agencia: string
  qtdVisitas: number
  qtdBraExpre: number
  data: string
  credenciamentos: Array<{
    id: string
    qtdCredenciamentos: number
    ativacoesValor: number
    ec: string
    volumeRS: number
    ra: boolean
    cesta: string
    pjInstalaDireto: boolean
  }>
}

type RankingItem = {
  executivo: string
  totalCredenciamentos: number
  totalAtivacoes: number
  bateuMeta: boolean
}

export default function Home() {
  const [executivo, setExecutivo] = useState('')
  const [agencia, setAgencia] = useState('')
  const [qtdVisitas, setQtdVisitas] = useState('')
  const [qtdBraExpre, setQtdBraExpre] = useState('')
  const [credenciamentos, setCredenciamentos] = useState<Credenciamento[]>([
    {
      id: crypto.randomUUID(),
      qtdCredenciamentos: '',
      ativacoesValor: '',
      ec: '',
      volumeRS: '',
      ra: '',
      cesta: '',
      pjInstalaDireto: ''
    }
  ])
  
  const [fechamentos, setFechamentos] = useState<Fechamento[]>([])
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [filtro, setFiltro] = useState('dia')
  const [loading, setLoading] = useState(false)

  const adicionarCredenciamento = () => {
    setCredenciamentos([
      ...credenciamentos,
      {
        id: crypto.randomUUID(),
        qtdCredenciamentos: '',
        ativacoesValor: '',
        ec: '',
        volumeRS: '',
        ra: '',
        cesta: '',
        pjInstalaDireto: ''
      }
    ])
  }

  const removerCredenciamento = (id: string) => {
    if (credenciamentos.length > 1) {
      setCredenciamentos(credenciamentos.filter(c => c.id !== id))
    }
  }

  const atualizarCredenciamento = (id: string, campo: string, valor: string) => {
    setCredenciamentos(credenciamentos.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const carregarFechamentos = async () => {
    try {
      const response = await fetch(`/api/fechamentos?filtro=${filtro}`)
      const data = await response.json()
      setFechamentos(data)
    } catch (error) {
      console.error('Erro ao carregar fechamentos:', error)
    }
  }

  const carregarRanking = async () => {
    try {
      const response = await fetch(`/api/fechamentos/ranking?filtro=${filtro}`)
      const data = await response.json()
      setRanking(data)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    }
  }

  useEffect(() => {
    carregarFechamentos()
    carregarRanking()
  }, [filtro])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação
    if (!executivo || !agencia || !qtdVisitas || !qtdBraExpre) {
      alert('Preencha todos os campos principais')
      return
    }

    const credenciamentosValidos = credenciamentos.every(c => 
      c.qtdCredenciamentos && c.ativacoesValor && c.ec && c.volumeRS && c.ra && c.cesta && c.pjInstalaDireto
    )

    if (!credenciamentosValidos) {
      alert('Preencha todos os campos de todos os credenciamentos')
      return
    }

    // Validar EC (10 dígitos)
    const ecValido = credenciamentos.every(c => c.ec.length === 10 && /^\d+$/.test(c.ec))
    if (!ecValido) {
      alert('O campo EC deve conter exatamente 10 números')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/fechamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          executivo,
          agencia,
          qtdVisitas,
          qtdBraExpre,
          data: new Date().toISOString(),
          credenciamentos
        })
      })

      if (response.ok) {
        alert('Fechamento salvo com sucesso!')
        
        // Limpar formulário
        setExecutivo('')
        setAgencia('')
        setQtdVisitas('')
        setQtdBraExpre('')
        setCredenciamentos([{
          id: crypto.randomUUID(),
          qtdCredenciamentos: '',
          ativacoesValor: '',
          ec: '',
          volumeRS: '',
          ra: '',
          cesta: '',
          pjInstalaDireto: ''
        }])
        
        // Recarregar dados
        carregarFechamentos()
        carregarRanking()
      } else {
        const error = await response.json()
        alert('Erro ao salvar: ' + error.error)
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar fechamento')
    } finally {
      setLoading(false)
    }
  }

  const getMeta = () => {
    return filtro === 'dia' ? 2 : filtro === 'semana' ? 10 : 40
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Fechamento Diário - CIELO
          </h1>
          <p className="text-gray-600">Sistema de acompanhamento dos Gerentes de Negócios</p>
        </div>

        <Tabs defaultValue="lancamento" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="lancamento">📝 Lançamento</TabsTrigger>
            <TabsTrigger value="ranking">📊 Ranking</TabsTrigger>
            <TabsTrigger value="relatorio">📋 Relatório</TabsTrigger>
          </TabsList>

          <TabsContent value="lancamento" className="space-y-8">
            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle>Novo Lançamento</CardTitle>
                <CardDescription>Registre o fechamento do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="executivo">Executivo (GN) *</Label>
                      <Input
                        id="executivo"
                        value={executivo}
                        onChange={(e) => setExecutivo(e.target.value)}
                        placeholder="Nome do Gerente"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência Visitada *</Label>
                      <Input
                        id="agencia"
                        value={agencia}
                        onChange={(e) => setAgencia(e.target.value)}
                        placeholder="Nome da agência"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qtdVisitas">Qtd de Visitas/Interações *</Label>
                      <Input
                        id="qtdVisitas"
                        type="number"
                        value={qtdVisitas}
                        onChange={(e) => setQtdVisitas(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qtdBraExpre">Qtd Bra Expre Visitado *</Label>
                      <Input
                        id="qtdBraExpre"
                        type="number"
                        value={qtdBraExpre}
                        onChange={(e) => setQtdBraExpre(e.target.value)}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Credenciamentos</h3>
                      <Button
                        type="button"
                        onClick={adicionarCredenciamento}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Credenciamento
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {credenciamentos.map((cred, index) => (
                        <Card key={cred.id} className="bg-gray-50">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Credenciamento #{index + 1}</h4>
                              {credenciamentos.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removerCredenciamento(cred.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Qtd Credenciamentos *</Label>
                                <Input
                                  type="number"
                                  value={cred.qtdCredenciamentos}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'qtdCredenciamentos', e.target.value)}
                                  placeholder="0"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Ativações do Dia (R$) *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cred.ativacoesValor}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'ativacoesValor', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>EC (10 números) *</Label>
                                <Input
                                  type="text"
                                  value={cred.ec}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'ec', e.target.value)}
                                  placeholder="0000000000"
                                  maxLength={10}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Volume R$ *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cred.volumeRS}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'volumeRS', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>RA *</Label>
                                <Select
                                  value={cred.ra}
                                  onValueChange={(value) => atualizarCredenciamento(cred.id, 'ra', value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Sim</SelectItem>
                                    <SelectItem value="false">Não</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>PJ Instala Direto *</Label>
                                <Select
                                  value={cred.pjInstalaDireto}
                                  onValueChange={(value) => atualizarCredenciamento(cred.id, 'pjInstalaDireto', value)}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Sim</SelectItem>
                                    <SelectItem value="false">Não</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <Label>Cesta *</Label>
                                <Input
                                  value={cred.cesta}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'cesta', e.target.value)}
                                  placeholder="Descrição da cesta"
                                  required
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Fechamento'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Tabela de Registros */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Registros</CardTitle>
                    <CardDescription>Visualize os lançamentos do período</CardDescription>
                  </div>
                  <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dia">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {fechamentos.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum registro encontrado</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Data</th>
                          <th className="text-left p-2">Executivo</th>
                          <th className="text-left p-2">Agência</th>
                          <th className="text-right p-2">Visitas</th>
                          <th className="text-right p-2">Bra Expre</th>
                          <th className="text-right p-2">Credenciamentos</th>
                          <th className="text-right p-2">Total Ativado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fechamentos.map((fechamento) => {
                          const totalCreds = fechamento.credenciamentos.reduce((sum, c) => sum + c.qtdCredenciamentos, 0)
                          const totalAtiv = fechamento.credenciamentos.reduce((sum, c) => sum + c.ativacoesValor, 0)
                          
                          return (
                            <tr key={fechamento.id} className="border-b hover:bg-gray-50">
                              <td className="p-2">{formatDate(fechamento.data)}</td>
                              <td className="p-2 font-medium">{fechamento.executivo}</td>
                              <td className="p-2">{fechamento.agencia}</td>
                              <td className="p-2 text-right">{fechamento.qtdVisitas}</td>
                              <td className="p-2 text-right">{fechamento.qtdBraExpre}</td>
                              <td className="p-2 text-right font-semibold">{totalCreds}</td>
                              <td className="p-2 text-right text-green-600 font-semibold">
                                {formatCurrency(totalAtiv)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🏆 Ranking dos GNs</h2>
              <Select value={filtro} onValueChange={setFiltro}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cards de Destaque */}
            {ranking.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Card Maior Quantidade */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <span className="text-2xl">🏆</span>
                      Maior Quantidade
                    </CardTitle>
                    <CardDescription className="text-yellow-600">
                      {filtro === 'dia' ? 'Melhor do dia' : filtro === 'semana' ? 'Melhor da semana' : 'Melhor do mês'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-700 mb-2">
                        {ranking[0]?.executivo || 'N/A'}
                      </div>
                      <div className="text-2xl font-semibold text-yellow-600">
                        {ranking[0]?.totalCredenciamentos || 0} credenciamentos
                      </div>
                      <div className="text-sm text-yellow-500 mt-1">
                        {filtro === 'dia' ? 'Hoje' : filtro === 'semana' ? 'Esta semana' : 'Este mês'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card Maior Volume */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <span className="text-2xl">💰</span>
                      Maior Volume
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      {filtro === 'dia' ? 'Melhor do dia' : filtro === 'semana' ? 'Melhor da semana' : 'Melhor do mês'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        {ranking.reduce((max, gn) => gn.totalAtivacoes > max.totalAtivacoes ? gn : max, ranking[0])?.executivo || 'N/A'}
                      </div>
                      <div className="text-2xl font-semibold text-green-600">
                        {formatCurrency(ranking.reduce((max, gn) => gn.totalAtivacoes > max.totalAtivacoes ? gn : max, ranking[0])?.totalAtivacoes || 0)}
                      </div>
                      <div className="text-sm text-green-500 mt-1">
                        {filtro === 'dia' ? 'Hoje' : filtro === 'semana' ? 'Esta semana' : 'Este mês'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Aviso para Relatório Semanal */}
            {filtro === 'semana' && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h3 className="font-semibold text-blue-800">Relatório Semanal</h3>
                      <p className="text-sm text-blue-600">
                        Este ranking será enviado toda sexta-feira após o preenchimento dos dias úteis (segunda a sexta).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {ranking.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-gray-500">Nenhum dado disponível para o período selecionado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {ranking.map((item, index) => (
                  <Card 
                    key={item.executivo} 
                    className={`${
                      index === 0 ? 'border-yellow-400 border-2 bg-yellow-50' :
                      index === 1 ? 'border-gray-400 border-2 bg-gray-50' :
                      index === 2 ? 'border-orange-400 border-2 bg-orange-50' :
                      item.totalCredenciamentos === 0 ? 'border-red-300 bg-red-50' :
                      ''
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl font-bold text-gray-400">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{item.executivo}</h3>
                            <p className="text-sm text-gray-600">
                              {item.bateuMeta ? (
                                <span className="text-green-600 font-semibold">✅ Meta batida!</span>
                              ) : item.totalCredenciamentos === 0 ? (
                                <span className="text-red-600 font-semibold">❌ Zerado</span>
                              ) : (
                                <span className="text-orange-600">⚠️ Abaixo da meta</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div>
                            <div className="text-sm text-gray-600">Credenciamentos</div>
                            <div className="text-2xl font-bold text-blue-600">
                              {item.totalCredenciamentos}
                              <span className="text-sm text-gray-500">/{getMeta()}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Total Ativado</div>
                            <div className="text-xl font-semibold text-green-600">
                              {formatCurrency(item.totalAtivacoes)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="relatorio" className="space-y-8">
            <RelatorioSemanal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

