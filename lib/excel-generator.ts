import * as XLSX from 'xlsx'
import { formatCurrency, formatPercent, calcularPerformance, getMetasPorGN } from './metas'

export interface ExcelData {
  titulo: string
  periodo: string
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
    fechamentos: Array<{
      data: string
      agencia: string
      qtdVisitas: number
      qtdInteracoes: number
      qtdBraExpre: number
      credenciamentos: Array<{
        ec: string
        volumeRS: number
        ra: boolean
        cesta: string
        instalaDireto: boolean
        nomeGerentePJ: string
      }>
      cnpjsSimulados: Array<{
        cnpj: string
        nomeEmpresa: string
        faturamento: number
        comentarios: string
      }>
    }>
  }>
  totaisGerais: {
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
  }
}

export const gerarExcelRelatorio = (data: ExcelData) => {
  const workbook = XLSX.utils.book_new()

  // 1. Resumo Executivo
  const resumoData = [
    ['RELATÓRIO SEMANAL DE PERFORMANCE - CIELO'],
    ['Período:', data.periodo],
    ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['RESUMO GERAL'],
    ['Total de Credenciamentos:', data.totaisGerais.totalCredenciamentos],
    ['Total de Ativações:', formatCurrency(data.totaisGerais.totalAtivacoes)],
    ['Total de Visitas:', data.totaisGerais.totalVisitas],
    ['Total de Interações:', data.totaisGerais.totalInteracoes],
    ['Total Bra Expre:', data.totaisGerais.totalBraExpre],
    ['Total CNPJs Simulados:', data.totaisGerais.totalCnpjsSimulados],
    ['Total Faturamento Simulado:', formatCurrency(data.totaisGerais.totalFaturamentoSimulado)],
    [''],
    ['PERFORMANCE POR GN'],
    ['GN', 'Credenciamentos', 'Meta Cred.', '% Meta Cred.', 'Volume', 'Meta Volume', '% Meta Volume', 'Visitas', 'Meta Visitas', '% Meta Visitas', 'Status Geral']
  ]

  data.dadosPorGN.forEach(gn => {
    const metas = getMetasPorGN(gn.executivo)
    const perfCred = calcularPerformance(gn.totalCredenciamentos, metas.credenciamentosPorSemana)
    const perfVolume = calcularPerformance(gn.totalAtivacoes, metas.volumePorSemana)
    const perfVisitas = calcularPerformance(gn.totalVisitas, metas.visitasPorSemana)
    
    const statusGeral = (perfCred.bateuMeta && perfVolume.bateuMeta && perfVisitas.bateuMeta) ? 'META BATIDA' : 'ABAIXO DA META'
    
    resumoData.push([
      gn.executivo,
      gn.totalCredenciamentos,
      metas.credenciamentosPorSemana,
      formatPercent(perfCred.percentual),
      formatCurrency(gn.totalAtivacoes),
      formatCurrency(metas.volumePorSemana),
      formatPercent(perfVolume.percentual),
      gn.totalVisitas,
      metas.visitasPorSemana,
      formatPercent(perfVisitas.percentual),
      statusGeral
    ])
  })

  const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData)
  XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo Executivo')

  // 2. Detalhamento por GN
  data.dadosPorGN.forEach(gn => {
    const metas = getMetasPorGN(gn.executivo)
    const perfCred = calcularPerformance(gn.totalCredenciamentos, metas.credenciamentosPorSemana)
    const perfVolume = calcularPerformance(gn.totalAtivacoes, metas.volumePorSemana)
    const perfVisitas = calcularPerformance(gn.totalVisitas, metas.visitasPorSemana)

    const gnData = [
      [`DETALHAMENTO - ${gn.executivo.toUpperCase()}`],
      ['Período:', data.periodo],
      [''],
      ['META vs REALIZADO'],
      ['Indicador', 'Realizado', 'Meta', 'Percentual', 'Status'],
      ['Credenciamentos', gn.totalCredenciamentos, metas.credenciamentosPorSemana, formatPercent(perfCred.percentual), perfCred.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      ['Volume (R$)', formatCurrency(gn.totalAtivacoes), formatCurrency(metas.volumePorSemana), formatPercent(perfVolume.percentual), perfVolume.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      ['Visitas', gn.totalVisitas, metas.visitasPorSemana, formatPercent(perfVisitas.percentual), perfVisitas.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      [''],
      ['RESUMO DA SEMANA'],
      ['Dias Trabalhados:', gn.diasTrabalhados],
      ['Dias Esperados:', gn.diasEsperados],
      ['Percentual de Presença:', formatPercent(gn.percentualPresenca)],
      ['Média Credenciamentos/Dia:', gn.mediaCredenciamentosPorDia],
      ['Média Visitas/Dia:', gn.mediaVisitasPorDia],
      ['Total Interações:', gn.totalInteracoes],
      ['Total Bra Expre:', gn.totalBraExpre],
      ['Total CNPJs Simulados:', gn.totalCnpjsSimulados],
      ['Total Faturamento Simulado:', formatCurrency(gn.totalFaturamentoSimulado)],
      [''],
      ['DETALHAMENTO POR DIA'],
      ['Data', 'Agência', 'Visitas', 'Interações', 'Bra Expre', 'Credenciamentos', 'Volume Cred.', 'CNPJs Simulados', 'Faturamento Sim.']
    ]

    gn.fechamentos.forEach(fechamento => {
      const totalCreds = fechamento.credenciamentos.length
      const totalVolume = fechamento.credenciamentos.reduce((sum, c) => sum + c.volumeRS, 0)
      const totalCnpjs = fechamento.cnpjsSimulados.length
      const totalFaturamento = fechamento.cnpjsSimulados.reduce((sum, c) => sum + c.faturamento, 0)

      gnData.push([
        new Date(fechamento.data).toLocaleDateString('pt-BR'),
        fechamento.agencia,
        fechamento.qtdVisitas.toString(),
        fechamento.qtdInteracoes.toString(),
        fechamento.qtdBraExpre.toString(),
        totalCreds.toString(),
        formatCurrency(totalVolume),
        totalCnpjs.toString(),
        formatCurrency(totalFaturamento)
      ])
    })

    gnData.push([''])
    gnData.push(['DETALHAMENTO DOS CREDENCIAMENTOS'])
    gnData.push(['Data', 'EC', 'Volume (R$)', 'RA', 'Cesta', 'Instala Direto', 'Gerente PJ'])

    gn.fechamentos.forEach(fechamento => {
      fechamento.credenciamentos.forEach(cred => {
        gnData.push([
          new Date(fechamento.data).toLocaleDateString('pt-BR'),
          cred.ec,
          formatCurrency(cred.volumeRS),
          cred.ra ? 'Sim' : 'Não',
          cred.cesta,
          cred.instalaDireto ? 'Sim' : 'Não',
          cred.nomeGerentePJ || '-'
        ])
      })
    })

    gnData.push([''])
    gnData.push(['DETALHAMENTO DOS CNPJs SIMULADOS'])
    gnData.push(['Data', 'CNPJ', 'Empresa', 'Faturamento (R$)', 'Comentários'])

    gn.fechamentos.forEach(fechamento => {
      fechamento.cnpjsSimulados.forEach(cnpj => {
        gnData.push([
          new Date(fechamento.data).toLocaleDateString('pt-BR'),
          cnpj.cnpj,
          cnpj.nomeEmpresa,
          formatCurrency(cnpj.faturamento),
          cnpj.comentarios || '-'
        ])
      })
    })

    const gnSheet = XLSX.utils.aoa_to_sheet(gnData)
    XLSX.utils.book_append_sheet(workbook, gnSheet, gn.executivo)
  })

  // 3. Análise Comparativa
  const comparativoData = [
    ['ANÁLISE COMPARATIVA - RANKING DOS GNs'],
    ['Período:', data.periodo],
    [''],
    ['Ranking por Credenciamentos'],
    ['Posição', 'GN', 'Credenciamentos', 'Meta', '% Meta', 'Status']
  ]

  const rankingCreds = data.dadosPorGN
    .map(gn => ({
      ...gn,
      metas: getMetasPorGN(gn.executivo),
      performance: calcularPerformance(gn.totalCredenciamentos, getMetasPorGN(gn.executivo).credenciamentosPorSemana)
    }))
    .sort((a, b) => b.totalCredenciamentos - a.totalCredenciamentos)

  rankingCreds.forEach((gn, index) => {
    comparativoData.push([
      (index + 1).toString(),
      gn.executivo,
      gn.totalCredenciamentos.toString(),
      gn.metas.credenciamentosPorSemana.toString(),
      formatPercent(gn.performance.percentual),
      gn.performance.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'
    ])
  })

  comparativoData.push([''])
  comparativoData.push(['Ranking por Volume'])
  comparativoData.push(['Posição', 'GN', 'Volume (R$)', 'Meta (R$)', '% Meta', 'Status'])

  const rankingVolume = data.dadosPorGN
    .map(gn => ({
      ...gn,
      metas: getMetasPorGN(gn.executivo),
      performance: calcularPerformance(gn.totalAtivacoes, getMetasPorGN(gn.executivo).volumePorSemana)
    }))
    .sort((a, b) => b.totalAtivacoes - a.totalAtivacoes)

  rankingVolume.forEach((gn, index) => {
    comparativoData.push([
      (index + 1).toString(),
      gn.executivo,
      formatCurrency(gn.totalAtivacoes),
      formatCurrency(gn.metas.volumePorSemana),
      formatPercent(gn.performance.percentual),
      gn.performance.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'
    ])
  })

  const comparativoSheet = XLSX.utils.aoa_to_sheet(comparativoData)
  XLSX.utils.book_append_sheet(workbook, comparativoSheet, 'Análise Comparativa')

  // Gerar nome do arquivo
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `relatorio-semanal-${timestamp}.xlsx`

  // Salvar arquivo
  XLSX.writeFile(workbook, filename)

  return filename
}
