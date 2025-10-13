'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2, TrendingUp, Users, Award, Check, Eye, Edit, X } from 'lucide-react'
import { RelatorioSemanal } from '@/components/RelatorioSemanal'
import { RelatorioCompleto } from '@/components/RelatorioCompleto'

// Função para obter foto do GN
const getFotoGN = (nome: string) => {
  const nomeLower = nome.toLowerCase()
  const fotos = {
    'dionei': '/fotos/dionei.jpg',
    'sheila': '/fotos/sheila.jpg',
    'renan': '/fotos/renan.jpg',
    'jeferson': '/fotos/jeferson.jpg',
    'jhonattan': '/fotos/jhonattan.jpg'
  }
  
  // Se encontrar a foto, retorna o caminho, senão retorna avatar com inicial
  if (fotos[nomeLower as keyof typeof fotos]) {
    return { tipo: 'foto', src: fotos[nomeLower as keyof typeof fotos] }
  }
  
  // Fallback para avatar com inicial
  const inicial = nome.charAt(0).toUpperCase()
  const cores = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500',
    'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ]
  const corIndex = nome.length % cores.length
  return { tipo: 'avatar', inicial, cor: cores[corIndex] }
}

// Componente para renderizar foto ou avatar
const FotoGN = ({ nome, tamanho = 'md' }: { nome: string, tamanho?: 'sm' | 'md' | 'lg' }) => {
  const foto = getFotoGN(nome)
  const tamanhos = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-16 sm:h-16'
  }
  const tamanhosTexto = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-xl sm:text-2xl'
  }

  if (foto.tipo === 'foto') {
    return (
      <img
        src={foto.src}
        alt={nome}
        className={`${tamanhos[tamanho]} rounded-full object-cover border-2 border-white shadow-md`}
        onError={(e) => {
          // Se a foto não carregar, mostra avatar com inicial
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            const fallback = document.createElement('div')
            const avatarData = getFotoGN(nome)
            fallback.className = `${tamanhos[tamanho]} rounded-full ${avatarData.cor} flex items-center justify-center text-white ${tamanhosTexto[tamanho]} font-bold`
            fallback.textContent = avatarData.inicial ?? '?'
            parent.appendChild(fallback)
          }
        }}
      />
    )
  }

  return (
    <div className={`${tamanhos[tamanho]} rounded-full ${foto.cor} flex items-center justify-center text-white ${tamanhosTexto[tamanho]} font-bold`}>
      {foto.inicial ?? '?'}
    </div>
  )
}

type Credenciamento = {
  id: string
  qtdCredenciamentos: string
  ativacoesValor: string
  ec: string
  volumeRS: string
  ra: string
  cesta: string
  instalaDireto: string
  nomeGerentePJ: string
}

type CnpjSimulado = {
  id: string
  cnpj: string
  nomeEmpresa: string
  faturamento: string
  comentarios: string
}

type Fechamento = {
  id: string
  executivo: string
  agencia: string
  qtdVisitas: number
  qtdInteracoes: number
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
    instalaDireto: boolean
    nomeGerentePJ: string
  }>
  cnpjsSimulados: Array<{
    id: string
    cnpj: string
    nomeEmpresa: string
    faturamento: number
    comentarios: string
  }>
}

type RankingItem = {
  executivo: string
  totalCredenciamentos: number
  totalAtivacoes: number
  totalVisitas: number
  totalInteracoes: number
  bateuMeta: boolean
  bateuMetaVisitas: boolean
}

export default function Home() {
  const [executivo, setExecutivo] = useState('')
  const [agencia, setAgencia] = useState('')
  const [qtdVisitas, setQtdVisitas] = useState('')
  const [qtdInteracoes, setQtdInteracoes] = useState('')
  const [qtdBraExpre, setQtdBraExpre] = useState('')
  const [dataFechamento, setDataFechamento] = useState(new Date().toISOString().split('T')[0])
  const [cnpjsSimulados, setCnpjsSimulados] = useState<CnpjSimulado[]>([])
  const [cnpjsSalvos, setCnpjsSalvos] = useState<CnpjSimulado[]>([])
  const [credenciamentos, setCredenciamentos] = useState<Credenciamento[]>([])
  
  const [fechamentos, setFechamentos] = useState<Fechamento[]>([])
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [filtro, setFiltro] = useState('dia')
  const [loading, setLoading] = useState(false)
  const [registroSelecionado, setRegistroSelecionado] = useState<Fechamento | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

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
        instalaDireto: '',
        nomeGerentePJ: ''
      }
    ])
  }

  const removerCredenciamento = (id: string) => {
    setCredenciamentos(credenciamentos.filter(c => c.id !== id))
  }

  const atualizarCredenciamento = (id: string, campo: string, valor: string) => {
    setCredenciamentos(credenciamentos.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const adicionarCnpjSimulado = () => {
    setCnpjsSimulados([
      ...cnpjsSimulados,
      {
        id: crypto.randomUUID(),
        cnpj: '',
        nomeEmpresa: '',
        faturamento: '',
        comentarios: ''
      }
    ])
  }

  const removerCnpjSimulado = (id: string) => {
    setCnpjsSimulados(cnpjsSimulados.filter(c => c.id !== id))
  }

  const atualizarCnpjSimulado = (id: string, campo: string, valor: string) => {
    setCnpjsSimulados(cnpjsSimulados.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const salvarCnpjSimulado = (id: string) => {
    const cnpjParaSalvar = cnpjsSimulados.find(c => c.id === id)
    if (cnpjParaSalvar && cnpjParaSalvar.cnpj && cnpjParaSalvar.nomeEmpresa && cnpjParaSalvar.faturamento) {
      setCnpjsSalvos([...cnpjsSalvos, cnpjParaSalvar])
      setCnpjsSimulados(cnpjsSimulados.filter(c => c.id !== id))
      alert('CNPJ salvo com sucesso!')
    } else {
      alert('Preencha todos os campos obrigatórios do CNPJ')
    }
  }

  const removerCnpjSalvo = (id: string) => {
    setCnpjsSalvos(cnpjsSalvos.filter(c => c.id !== id))
  }

  const abrirModalRegistro = (fechamento: Fechamento) => {
    setRegistroSelecionado(fechamento)
    setMostrarModal(true)
  }

  const fecharModal = () => {
    setMostrarModal(false)
    setRegistroSelecionado(null)
  }

  const excluirRegistro = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return
    }

    try {
      const response = await fetch(`/api/fechamentos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Registro excluído com sucesso!')
        carregarFechamentos()
        carregarRanking()
        fecharModal()
      } else {
        alert('Erro ao excluir registro')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir registro')
    }
  }

  const editarRegistro = (fechamento: Fechamento) => {
    // Preencher formulário com dados do registro
    setDataFechamento(fechamento.data.split('T')[0])
    setExecutivo(fechamento.executivo)
    setAgencia(fechamento.agencia)
    setQtdVisitas(fechamento.qtdVisitas.toString())
    setQtdInteracoes(fechamento.qtdInteracoes.toString())
    setQtdBraExpre(fechamento.qtdBraExpre.toString())
    
    // Converter credenciamentos para formato do formulário
    const credenciamentosFormatados = fechamento.credenciamentos.map(cred => ({
      id: crypto.randomUUID(),
      qtdCredenciamentos: cred.qtdCredenciamentos.toString(),
      ativacoesValor: cred.ativacoesValor.toString(),
      ec: cred.ec,
      volumeRS: cred.volumeRS.toString(),
      ra: cred.ra ? 'true' : 'false',
      cesta: cred.cesta,
      instalaDireto: cred.instalaDireto ? 'true' : 'false',
      nomeGerentePJ: cred.nomeGerentePJ || ''
    }))
    setCredenciamentos(credenciamentosFormatados)
    
    // Converter CNPJs simulados para formato do formulário
    const cnpjsFormatados = fechamento.cnpjsSimulados.map(cnpj => ({
      id: crypto.randomUUID(),
      cnpj: cnpj.cnpj,
      nomeEmpresa: cnpj.nomeEmpresa,
      faturamento: cnpj.faturamento.toString(),
      comentarios: cnpj.comentarios || ''
    }))
    setCnpjsSalvos(cnpjsFormatados)
    setCnpjsSimulados([])
    
    // Configurar modo de edição
    setRegistroSelecionado(fechamento)
    setModoEdicao(true)
    fecharModal()
    
    // Ir para aba de lançamento
    const lancamentoTab = document.querySelector('[value="lancamento"]') as HTMLElement
    if (lancamentoTab) {
      lancamentoTab.click()
    }
  }

  const excluirRegistroDireto = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return
    }

    try {
      const response = await fetch(`/api/fechamentos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Registro excluído com sucesso!')
        carregarFechamentos()
        carregarRanking()
      } else {
        alert('Erro ao excluir registro')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir registro')
    }
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
    if (!dataFechamento || !executivo || !agencia || !qtdVisitas || !qtdInteracoes || !qtdBraExpre) {
      alert('Preencha todos os campos principais')
      return
    }

    // CNPJs Simulados agora são opcionais

    // Se há credenciamentos, validar se estão preenchidos corretamente
    if (credenciamentos.length > 0) {
      const credenciamentosValidos = credenciamentos.every(c => 
        c.qtdCredenciamentos && c.ativacoesValor && c.ec && c.volumeRS && c.ra && c.cesta && c.instalaDireto
      )

      if (!credenciamentosValidos) {
        alert('Preencha todos os campos de todos os credenciamentos ou remova os credenciamentos vazios')
        return
      }

      // Validar EC (10 dígitos)
      const ecValido = credenciamentos.every(c => c.ec.length === 10 && /^\d+$/.test(c.ec))
      if (!ecValido) {
        alert('O campo EC deve conter exatamente 10 números')
        return
      }
    }

    setLoading(true)

    try {
      let response
      
      if (modoEdicao && registroSelecionado) {
        // Modo edição - atualizar registro existente
        response = await fetch(`/api/fechamentos/${registroSelecionado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            executivo,
            agencia,
            qtdVisitas: parseInt(qtdVisitas),
            qtdInteracoes: parseInt(qtdInteracoes),
            qtdBraExpre: parseInt(qtdBraExpre),
            data: registroSelecionado.data,
            credenciamentos,
            cnpjsSimulados: cnpjsSalvos
          })
        })
      } else {
        // Modo criação - criar novo registro
        response = await fetch('/api/fechamentos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            executivo,
            agencia,
            qtdVisitas: parseInt(qtdVisitas),
            qtdInteracoes: parseInt(qtdInteracoes),
            qtdBraExpre: parseInt(qtdBraExpre),
            data: dataFechamento,
            credenciamentos,
            cnpjsSimulados: cnpjsSalvos
          })
        })
      }

      if (response.ok) {
        alert(modoEdicao ? 'Fechamento atualizado com sucesso!' : 'Fechamento salvo com sucesso!')
        
        // Limpar formulário
        setDataFechamento(new Date().toISOString().split('T')[0])
        setExecutivo('')
        setAgencia('')
        setQtdVisitas('')
        setQtdInteracoes('')
        setQtdBraExpre('')
        setCnpjsSimulados([])
        setCnpjsSalvos([])
        setCredenciamentos([])
        setModoEdicao(false)
        setRegistroSelecionado(null)
        
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

  const getMetaVisitas = () => {
    return filtro === 'dia' ? 6 : filtro === 'semana' ? 30 : 120
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Fechamento Diário - CIELO
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Sistema de acompanhamento dos Gerentes de Negócios</p>
        </div>

        <Tabs defaultValue="lancamento" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-6 sm:mb-8 h-auto">
            <TabsTrigger value="lancamento" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📝 </span>Lançamento
            </TabsTrigger>
            <TabsTrigger value="ranking" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📊 </span>Ranking
            </TabsTrigger>
            <TabsTrigger value="relatorio" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📋 </span>Relatório
            </TabsTrigger>
            <TabsTrigger value="relatorio-completo" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">📊 </span>Prestação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lancamento" className="space-y-4 sm:space-y-8">
            {/* Formulário */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Novo Lançamento</CardTitle>
                <CardDescription className="text-sm">Registre o fechamento do dia</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataFechamento">Data do Fechamento *</Label>
                      <Input
                        id="dataFechamento"
                        type="date"
                        value={dataFechamento}
                        onChange={(e) => setDataFechamento(e.target.value)}
                        required
                      />
                    </div>

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
                      <Label htmlFor="qtdVisitas">Qtd de Visitas (Presenciais) *</Label>
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
                      <Label htmlFor="qtdInteracoes">Qtd de Interações (Ligações + WhatsApp) *</Label>
                      <Input
                        id="qtdInteracoes"
                        type="number"
                        value={qtdInteracoes}
                        onChange={(e) => setQtdInteracoes(e.target.value)}
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

                  {/* CNPJs Simulados */}
                  <div className="border-t pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">CNPJs Simulados</h3>
                      <Button
                        type="button"
                        onClick={adicionarCnpjSimulado}
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Adicionar CNPJ</span>
                      </Button>
                    </div>

      {/* CNPJs Salvos */}
      {cnpjsSalvos.length > 0 ? (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-700 mb-3">✅ CNPJs Salvos ({cnpjsSalvos.length})</h4>
                        <div className="space-y-3">
                          {cnpjsSalvos.map((cnpj, index) => (
                            <Card key={cnpj.id} className="bg-green-50 border-green-200">
                              <CardContent className="pt-4 pb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium text-green-800">CNPJ #{index + 1}: {cnpj.cnpj}</h5>
                                  <Button
                                    type="button"
                                    onClick={() => removerCnpjSalvo(cnpj.id)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                                <div className="text-sm text-green-700">
                                  <p><strong>Empresa:</strong> {cnpj.nomeEmpresa}</p>
                                  <p><strong>Faturamento:</strong> R$ {parseFloat(cnpj.faturamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  {cnpj.comentarios && <p><strong>Comentários:</strong> {cnpj.comentarios}</p>}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-gray-600">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-semibold mb-2">Nenhum CNPJ Simulado</h4>
                <p className="text-sm">Você pode adicionar CNPJs simulados se desejar.</p>
                <p className="text-xs mt-1 text-gray-500">Clique em "Adicionar CNPJ" se houver simulações.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CNPJs em Edição */}
                    <div className="space-y-4">
                      {cnpjsSimulados.map((cnpj, index) => (
                        <Card key={cnpj.id} className="bg-blue-50 border-blue-200">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-blue-800">CNPJ Simulado #{index + 1}</h4>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() => salvarCnpjSimulado(cnpj.id)}
                                  variant="default"
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Salvar
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => removerCnpjSimulado(cnpj.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              <div className="space-y-2">
                                <Label>CNPJ (apenas números) *</Label>
                                <Input
                                  type="text"
                                  value={cnpj.cnpj}
                                  onChange={(e) => {
                                    const valor = e.target.value.replace(/\D/g, '')
                                    if (valor.length <= 14) {
                                      atualizarCnpjSimulado(cnpj.id, 'cnpj', valor)
                                    }
                                  }}
                                  placeholder="00000000000000"
                                  maxLength={14}
                                  required
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-2">
                                <Label>Nome da Empresa *</Label>
                                <Input
                                  value={cnpj.nomeEmpresa}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'nomeEmpresa', e.target.value)}
                                  placeholder="Nome da empresa"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Faturamento (R$) *</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cnpj.faturamento}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'faturamento', e.target.value)}
                                  placeholder="0.00"
                                  min="0"
                                  required
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                <Label>Comentários sobre a Simulação</Label>
                                <Input
                                  value={cnpj.comentarios}
                                  onChange={(e) => atualizarCnpjSimulado(cnpj.id, 'comentarios', e.target.value)}
                                  placeholder="Descreva os detalhes da simulação realizada"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 sm:pt-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">Credenciamentos</h3>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          onClick={() => setCredenciamentos([])}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <span className="text-sm">❌ Sem Credenciamentos</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={adicionarCredenciamento}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="text-sm">Adicionar</span>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {credenciamentos.length === 0 ? (
                        <Card className="bg-gray-50 border-gray-200">
                          <CardContent className="pt-6 pb-6 text-center">
                            <div className="text-gray-600">
                              <div className="text-2xl mb-2">📋</div>
                              <h4 className="font-semibold mb-2">Sem Credenciamentos</h4>
                              <p className="text-sm">Este GN não realizou nenhum credenciamento hoje.</p>
                              <p className="text-xs mt-1 text-gray-500">Clique em "Adicionar" se houver credenciamentos.</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        credenciamentos.map((cred, index) => (
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                                <Label>Instala Direto *</Label>
                                <Select
                                  value={cred.instalaDireto}
                                  onValueChange={(value) => atualizarCredenciamento(cred.id, 'instalaDireto', value)}
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
                                <Label>Nome do Gerente PJ</Label>
                                <Input
                                  value={cred.nomeGerentePJ}
                                  onChange={(e) => atualizarCredenciamento(cred.id, 'nomeGerentePJ', e.target.value)}
                                  placeholder="Nome do gerente PJ que auxiliou"
                                />
                              </div>

                              <div className="space-y-2 sm:col-span-2 lg:col-span-3">
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
                        ))
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (modoEdicao ? 'Atualizando...' : 'Salvando...') : (modoEdicao ? 'Atualizar Fechamento' : 'Salvar Fechamento')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Tabela de Registros */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Registros</CardTitle>
                    <CardDescription className="text-sm">Visualize os lançamentos do período</CardDescription>
                  </div>
                  <Select value={filtro} onValueChange={setFiltro}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                    <table className="w-full text-sm sm:text-base">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 text-xs sm:text-sm">Data</th>
                          <th className="text-left p-2 text-xs sm:text-sm">Executivo</th>
                          <th className="text-left p-2 text-xs sm:text-sm hidden sm:table-cell">Agência</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Visitas</th>
                          <th className="text-right p-2 text-xs sm:text-sm hidden md:table-cell">Interações</th>
                          <th className="text-right p-2 text-xs sm:text-sm hidden lg:table-cell">Bra Expre</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Creds</th>
                          <th className="text-right p-2 text-xs sm:text-sm">Total</th>
                          <th className="text-center p-2 text-xs sm:text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fechamentos.map((fechamento) => {
                          const totalCreds = fechamento.credenciamentos.reduce((sum, c) => sum + c.qtdCredenciamentos, 0)
                          const totalAtiv = fechamento.credenciamentos.reduce((sum, c) => sum + c.volumeRS, 0)
                          
                          return (
                            <tr 
                              key={fechamento.id} 
                              className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => abrirModalRegistro(fechamento)}
                            >
                              <td className="p-2 text-xs sm:text-sm">{formatDate(fechamento.data)}</td>
                              <td className="p-2 font-medium text-xs sm:text-sm">
                                <div className="flex items-center gap-2">
                                  <FotoGN nome={fechamento.executivo} tamanho="sm" />
                                  <span>{fechamento.executivo}</span>
                                </div>
                              </td>
                              <td className="p-2 text-xs sm:text-sm hidden sm:table-cell">{fechamento.agencia}</td>
                              <td className="p-2 text-right text-xs sm:text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{fechamento.qtdVisitas}</span>
                                  <span className="text-xs text-gray-500">
                                    {Math.round((fechamento.qtdVisitas / 6) * 100)}%
                                  </span>
                                </div>
                              </td>
                              <td className="p-2 text-right text-xs sm:text-sm hidden md:table-cell">{fechamento.qtdInteracoes}</td>
                              <td className="p-2 text-right text-xs sm:text-sm hidden lg:table-cell">{fechamento.qtdBraExpre}</td>
                              <td className="p-2 text-right font-semibold text-xs sm:text-sm">{totalCreds}</td>
                              <td className="p-2 text-right text-green-600 font-semibold text-xs sm:text-sm">
                                {formatCurrency(totalAtiv)}
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      abrirModalRegistro(fechamento)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-4 h-4 text-blue-500" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      editarRegistro(fechamento)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      excluirRegistroDireto(fechamento.id)
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
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

          <TabsContent value="ranking" className="space-y-4 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold">🏆 Ranking dos GNs</h2>
              <Select value={filtro} onValueChange={setFiltro}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Card Maior Quantidade */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-yellow-700 text-sm sm:text-base">
                      <span className="text-xl sm:text-2xl">🏆</span>
                      Maior Quantidade
                    </CardTitle>
                    <CardDescription className="text-yellow-600 text-xs sm:text-sm">
                      {filtro === 'dia' ? 'Melhor do dia' : filtro === 'semana' ? 'Melhor da semana' : 'Melhor do mês'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {ranking[0]?.executivo && (
                        <div className="flex justify-center mb-3">
                          <FotoGN nome={ranking[0].executivo} tamanho="lg" />
                        </div>
                      )}
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-700 mb-2">
                        {ranking[0]?.executivo || 'N/A'}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-600">
                        {ranking[0]?.totalCredenciamentos || 0} credenciamentos
                      </div>
                      <div className="text-xs sm:text-sm text-yellow-500 mt-1">
                        {filtro === 'dia' ? 'Hoje' : filtro === 'semana' ? 'Esta semana' : 'Este mês'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card Maior Volume */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700 text-sm sm:text-base">
                      <span className="text-xl sm:text-2xl">💰</span>
                      Maior Volume
                    </CardTitle>
                    <CardDescription className="text-green-600 text-xs sm:text-sm">
                      {filtro === 'dia' ? 'Melhor do dia' : filtro === 'semana' ? 'Melhor da semana' : 'Melhor do mês'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      {ranking.length > 0 && (() => {
                        const maiorVolume = ranking.reduce((max, gn) => gn.totalAtivacoes > max.totalAtivacoes ? gn : max, ranking[0])
                        return maiorVolume?.executivo && (
                          <div className="flex justify-center mb-3">
                            <FotoGN nome={maiorVolume.executivo} tamanho="lg" />
                          </div>
                        )
                      })()}
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-2">
                        {ranking.reduce((max, gn) => gn.totalAtivacoes > max.totalAtivacoes ? gn : max, ranking[0])?.executivo || 'N/A'}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-600">
                        {formatCurrency(ranking.reduce((max, gn) => gn.totalAtivacoes > max.totalAtivacoes ? gn : max, ranking[0])?.totalAtivacoes || 0)}
                      </div>
                      <div className="text-xs sm:text-sm text-green-500 mt-1">
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
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">📊</span>
                    <div>
                      <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Relatório Semanal</h3>
                      <p className="text-xs sm:text-sm text-blue-600">
                        Este ranking será enviado toda sexta-feira após o preenchimento dos dias úteis (segunda a sexta).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {ranking.length === 0 ? (
              <Card>
                <CardContent className="py-8 sm:py-12">
                  <p className="text-center text-gray-500 text-sm sm:text-base">Nenhum dado disponível para o período selecionado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="text-2xl sm:text-3xl font-bold text-gray-400">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <FotoGN nome={item.executivo} tamanho="md" />
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold">{item.executivo}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">
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
                        
                        <div className="flex sm:flex-col gap-4 sm:gap-2 w-full sm:w-auto">
                          <div className="text-center sm:text-right">
                            <div className="text-xs sm:text-sm text-gray-600">Credenciamentos</div>
                            <div className="text-lg sm:text-2xl font-bold text-blue-600">
                              {item.totalCredenciamentos}
                              <span className="text-xs sm:text-sm text-gray-500">/{getMeta()}</span>
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="text-xs sm:text-sm text-gray-600">Visitas</div>
                            <div className="text-base sm:text-xl font-semibold text-purple-600">
                              {item.totalVisitas}
                              <span className="text-xs sm:text-sm text-gray-500">/{getMetaVisitas()}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round((item.totalVisitas / getMetaVisitas()) * 100)}%
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="text-xs sm:text-sm text-gray-600">Total Ativado</div>
                            <div className="text-base sm:text-xl font-semibold text-green-600">
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

          <TabsContent value="relatorio" className="space-y-4 sm:space-y-8">
            <RelatorioSemanal />
          </TabsContent>

          <TabsContent value="relatorio-completo" className="space-y-4 sm:space-y-8">
            <RelatorioCompleto />
          </TabsContent>
        </Tabs>

        {/* Modal de Detalhes do Registro */}
        {mostrarModal && registroSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Detalhes do Registro</h2>
                  <Button onClick={fecharModal} variant="ghost" size="sm">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Informações Básicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FotoGN nome={registroSelecionado.executivo} tamanho="md" />
                        <div>
                          <p className="font-semibold">{registroSelecionado.executivo}</p>
                          <p className="text-sm text-gray-600">{registroSelecionado.agencia}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Data:</p>
                          <p className="font-semibold">{formatDate(registroSelecionado.data)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Visitas:</p>
                          <p className="font-semibold">{registroSelecionado.qtdVisitas}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Interações:</p>
                          <p className="font-semibold">{registroSelecionado.qtdInteracoes}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bra Expre:</p>
                          <p className="font-semibold">{registroSelecionado.qtdBraExpre}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Credenciamentos */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Credenciamentos ({registroSelecionado.credenciamentos.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {registroSelecionado.credenciamentos.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          <p>❌ Nenhum credenciamento registrado</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {registroSelecionado.credenciamentos.map((cred, index) => (
                            <div key={cred.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">Credenciamento #{index + 1}</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-600">Quantidade:</p>
                                  <p className="font-semibold">{cred.qtdCredenciamentos}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Ativações:</p>
                                  <p className="font-semibold">{formatCurrency(cred.ativacoesValor)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">EC:</p>
                                  <p className="font-semibold">{cred.ec}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Volume R$:</p>
                                  <p className="font-semibold">{formatCurrency(cred.volumeRS)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">RA:</p>
                                  <p className="font-semibold">{cred.ra ? 'Sim' : 'Não'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Instala Direto:</p>
                                  <p className="font-semibold">{cred.instalaDireto ? 'Sim' : 'Não'}</p>
                                </div>
                                {cred.nomeGerentePJ && (
                                  <div className="col-span-2">
                                    <p className="text-gray-600">Gerente PJ:</p>
                                    <p className="font-semibold">{cred.nomeGerentePJ}</p>
                                  </div>
                                )}
                                <div className="col-span-2">
                                  <p className="text-gray-600">Cesta:</p>
                                  <p className="font-semibold">{cred.cesta}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* CNPJs Simulados */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>CNPJs Simulados ({registroSelecionado.cnpjsSimulados.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {registroSelecionado.cnpjsSimulados.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        <p>📋 Nenhum CNPJ simulado registrado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {registroSelecionado.cnpjsSimulados.map((cnpj, index) => (
                          <div key={cnpj.id} className="border rounded-lg p-3 bg-blue-50">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">CNPJ #{index + 1}</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">CNPJ:</p>
                                <p className="font-semibold">{cnpj.cnpj}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Empresa:</p>
                                <p className="font-semibold">{cnpj.nomeEmpresa}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Faturamento:</p>
                                <p className="font-semibold">{formatCurrency(cnpj.faturamento)}</p>
                              </div>
                              {cnpj.comentarios && (
                                <div>
                                  <p className="text-gray-600">Comentários:</p>
                                  <p className="font-semibold">{cnpj.comentarios}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Botões de Ação */}
                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button onClick={() => excluirRegistro(registroSelecionado.id)} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Registro
                  </Button>
                  <Button onClick={fecharModal} variant="outline">
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

