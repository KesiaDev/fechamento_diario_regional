import jsPDF from 'jspdf'
import { formatCurrency, formatPercent, calcularPerformance, getMetasPorGN } from './metas'

export interface PDFData {
  titulo: string
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
    agencia?: string
    qtdVisitas?: number
    qtdInteracoes?: number
    qtdBraExpre?: number
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas?: number
    totalInteracoes?: number
    totalBraExpre?: number
    totalCnpjsSimulados?: number
    totalFaturamentoSimulado?: number
    bateuMetaCredenciamentos: boolean
    bateuMetaVisitas: boolean
    percentualVisitas?: number
    diasTrabalhados?: number
    diasEsperados?: number
    percentualPresenca?: number
    mediaCredenciamentosPorDia?: number
    mediaVisitasPorDia?: number
    diasUteisEsperados?: number
  }>
  metas: {
    credenciamentosPorDia?: number
    visitasPorDia?: number
    credenciamentosPorSemana?: number
    visitasPorSemana?: number
    credenciamentosPorMes?: number
    visitasPorMes?: number
    totalGNs: number
  }
}

export const gerarPDFRelatorio = async (data: PDFData, tipo: 'diario' | 'semanal' | 'mensal') => {
  // Configurar PDF com orientação portrait e unidade em mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // Configurações do PDF
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  let yPosition = margin
  
  // Função para adicionar texto com quebra de linha
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const lines = doc.splitTextToSize(text, contentWidth)
    doc.text(lines, x, y, options)
    return y + (lines.length * (options.lineHeight || 7))
  }
  
  // Função para adicionar texto centralizado
  const addCenteredText = (text: string, y: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'normal')
    const textWidth = doc.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    doc.text(text, x, y)
    return y + fontSize + 2
  }
  
  // Função para adicionar título
  const addTitle = (text: string, y: number) => {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    const textWidth = doc.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    doc.text(text, x, y)
    return y + 20
  }
  
  // Função para adicionar subtítulo
  const addSubtitle = (text: string, y: number) => {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(text, margin, y)
    return y + 15
  }
  
  // Função para adicionar texto normal
  const addNormalText = (text: string, y: number) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    return addText(text, margin, y)
  }
  
  // Função para adicionar linha
  const addLine = (y: number) => {
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageWidth - margin, y)
    return y + 10
  }
  
  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  // Função para verificar se precisa de nova página
  const checkNewPage = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }
  
  // Cabeçalho
  yPosition = addTitle('CIELO - Relatório de Performance', yPosition)
  yPosition = addTitle(data.titulo, yPosition)
  yPosition = addCenteredText(`Período: ${data.periodo}`, yPosition, 12)
  yPosition = addCenteredText(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, yPosition, 10)
  yPosition = addLine(yPosition)
  
  // Resumo Executivo
  checkNewPage(50)
  yPosition = addSubtitle('RESUMO EXECUTIVO', yPosition)
  yPosition = addNormalText(`Total de GNs com atividade: ${data.resumo.totalGNs}`, yPosition)
  yPosition = addNormalText(`GNs que bateram meta de credenciamentos: ${data.resumo.gnsBateramMetaCredenciamentos} (${data.resumo.percentualMetaCredenciamentos}%)`, yPosition)
  yPosition = addNormalText(`GNs que bateram meta de visitas: ${data.resumo.gnsBateramMetaVisitas} (${data.resumo.percentualMetaVisitas}%)`, yPosition)
  yPosition = addLine(yPosition)
  
  // Totais Gerais
  checkNewPage(40)
  yPosition = addSubtitle('TOTAIS GERAIS', yPosition)
  yPosition = addNormalText(`Total de Credenciamentos: ${data.totaisGerais.totalCredenciamentos}`, yPosition)
  yPosition = addNormalText(`Total de Volume R$: ${formatCurrency(data.totaisGerais.totalAtivacoes)}`, yPosition)
  yPosition = addNormalText(`Total de Visitas: ${data.totaisGerais.totalVisitas}`, yPosition)
  yPosition = addNormalText(`Total de Interações: ${data.totaisGerais.totalInteracoes}`, yPosition)
  yPosition = addNormalText(`Total de Bra Expre: ${data.totaisGerais.totalBraExpre}`, yPosition)
  yPosition = addNormalText(`Total de CNPJs Simulados: ${data.totaisGerais.totalCnpjsSimulados}`, yPosition)
  yPosition = addNormalText(`Faturamento Simulado Total: ${formatCurrency(data.totaisGerais.totalFaturamentoSimulado)}`, yPosition)
  yPosition = addLine(yPosition)
  
  // Metas
  checkNewPage(30)
  yPosition = addSubtitle('METAS', yPosition)
  if (tipo === 'diario') {
    yPosition = addNormalText(`Meta Diária de Credenciamentos: ${data.metas.credenciamentosPorDia} por GN`, yPosition)
    yPosition = addNormalText(`Meta Diária de Visitas: ${data.metas.visitasPorDia} por GN`, yPosition)
  } else if (tipo === 'semanal') {
    yPosition = addNormalText(`Meta Semanal de Credenciamentos: ${data.metas.credenciamentosPorSemana} por GN`, yPosition)
    yPosition = addNormalText(`Meta Semanal de Visitas: ${data.metas.visitasPorSemana} por GN`, yPosition)
  } else if (tipo === 'mensal') {
    yPosition = addNormalText(`Meta Mensal de Credenciamentos: ${data.metas.credenciamentosPorMes} por GN`, yPosition)
    yPosition = addNormalText(`Meta Mensal de Visitas: ${data.metas.visitasPorMes} por GN`, yPosition)
  }
  yPosition = addNormalText(`Total de GNs: ${data.metas.totalGNs}`, yPosition)
  yPosition = addLine(yPosition)
  
  // Performance por GN
  checkNewPage(60)
  yPosition = addSubtitle('PERFORMANCE POR GN', yPosition)
  
  data.dadosPorGN.forEach((gn, index) => {
    // Verificar se precisa de nova página para este GN
    checkNewPage(40)
    
    // Nome do GN
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    yPosition = addText(`${index + 1}. ${gn.executivo}`, margin, yPosition)
    
    // Informações básicas
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    if (gn.agencia) {
      yPosition = addNormalText(`Agência: ${gn.agencia}`, yPosition)
    }
    
    // Dados específicos por tipo de relatório
    if (tipo === 'diario') {
      yPosition = addNormalText(`Credenciamentos: ${gn.totalCredenciamentos} (Meta: ${data.metas.credenciamentosPorDia}) ${gn.bateuMetaCredenciamentos ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Volume R$: ${formatCurrency(gn.totalAtivacoes)}`, yPosition)
      yPosition = addNormalText(`Visitas: ${gn.qtdVisitas || 0} (Meta: ${data.metas.visitasPorDia}) ${gn.bateuMetaVisitas ? '✅' : '❌'} (${gn.percentualVisitas || 0}%)`, yPosition)
      yPosition = addNormalText(`Interações: ${gn.qtdInteracoes || 0}`, yPosition)
      yPosition = addNormalText(`Bra Expre: ${gn.qtdBraExpre || 0}`, yPosition)
      yPosition = addNormalText(`CNPJs Simulados: ${gn.totalCnpjsSimulados || 0}`, yPosition)
      yPosition = addNormalText(`Faturamento Simulado: ${formatCurrency(gn.totalFaturamentoSimulado || 0)}`, yPosition)
    } else if (tipo === 'semanal') {
      const metas = getMetasPorGN(gn.executivo)
      const perfCred = calcularPerformance(gn.totalCredenciamentos, metas.credenciamentosPorSemana)
      const perfVolume = calcularPerformance(gn.totalAtivacoes, metas.volumePorSemana)
      const perfVisitas = calcularPerformance(gn.totalVisitas || 0, metas.visitasPorSemana)
      
      yPosition = addNormalText(`Dias Trabalhados: ${gn.diasTrabalhados}/${gn.diasEsperados} (${gn.percentualPresenca}%)`, yPosition)
      yPosition = addNormalText(`Credenciamentos: ${gn.totalCredenciamentos}/${metas.credenciamentosPorSemana} (${formatPercent(perfCred.percentual)}) ${perfCred.bateuMeta ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Média Credenciamentos/Dia: ${gn.mediaCredenciamentosPorDia}`, yPosition)
      yPosition = addNormalText(`Volume: ${formatCurrency(gn.totalAtivacoes)}/${formatCurrency(metas.volumePorSemana)} (${formatPercent(perfVolume.percentual)}) ${perfVolume.bateuMeta ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Visitas: ${gn.totalVisitas || 0}/${metas.visitasPorSemana} (${formatPercent(perfVisitas.percentual)}) ${perfVisitas.bateuMeta ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Média Visitas/Dia: ${gn.mediaVisitasPorDia}`, yPosition)
      yPosition = addNormalText(`Interações: ${gn.totalInteracoes || 0}`, yPosition)
      yPosition = addNormalText(`Bra Expre: ${gn.totalBraExpre || 0}`, yPosition)
      yPosition = addNormalText(`CNPJs Simulados: ${gn.totalCnpjsSimulados || 0}`, yPosition)
      yPosition = addNormalText(`Faturamento Simulado: ${formatCurrency(gn.totalFaturamentoSimulado || 0)}`, yPosition)
      
      // Status geral
      const statusGeral = (perfCred.bateuMeta && perfVolume.bateuMeta && perfVisitas.bateuMeta) ? 'META BATIDA' : 'ABAIXO DA META'
      yPosition = addNormalText(`Status Geral: ${statusGeral}`, yPosition)
    } else if (tipo === 'mensal') {
      yPosition = addNormalText(`Dias Trabalhados: ${gn.diasTrabalhados}/${gn.diasUteisEsperados} (${gn.percentualPresenca}%)`, yPosition)
      yPosition = addNormalText(`Credenciamentos: ${gn.totalCredenciamentos} (Meta: ${data.metas.credenciamentosPorMes}) ${gn.bateuMetaCredenciamentos ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Média Credenciamentos/Dia: ${gn.mediaCredenciamentosPorDia}`, yPosition)
      yPosition = addNormalText(`Volume R$: ${formatCurrency(gn.totalAtivacoes)}`, yPosition)
      yPosition = addNormalText(`Visitas: ${gn.totalVisitas || 0} (Meta: ${data.metas.visitasPorMes}) ${gn.bateuMetaVisitas ? '✅' : '❌'}`, yPosition)
      yPosition = addNormalText(`Média Visitas/Dia: ${gn.mediaVisitasPorDia}`, yPosition)
      yPosition = addNormalText(`Interações: ${gn.totalInteracoes || 0}`, yPosition)
      yPosition = addNormalText(`Bra Expre: ${gn.totalBraExpre || 0}`, yPosition)
      yPosition = addNormalText(`CNPJs Simulados: ${gn.totalCnpjsSimulados || 0}`, yPosition)
      yPosition = addNormalText(`Faturamento Simulado: ${formatCurrency(gn.totalFaturamentoSimulado || 0)}`, yPosition)
    }
    
    yPosition += 5 // Espaço entre GNs
  })
  
  // Rodapé
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    
    // Página atual
    const pageText = `Página ${i} de ${totalPages}`
    const pageTextWidth = doc.getTextWidth(pageText)
    doc.text(pageText, pageWidth - pageTextWidth - margin, pageHeight - 10)
    
    // Sistema
    doc.text('CIELO - Sistema de Acompanhamento', margin, pageHeight - 10)
  }
  
  // Gerar nome do arquivo
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `relatorio-${tipo}-${timestamp}.pdf`
  
  // Salvar PDF
  doc.save(filename)
}