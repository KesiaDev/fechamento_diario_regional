import * as XLSX from 'xlsx'
import { formatCurrency, formatPercent, calcularPerformance, getMetasPorGN } from './metas'
import { formatCurrency as formatCurrencyUtil } from './utils'

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

export interface ExcelDataCompleto {
  titulo: string
  periodo: string
  tipoRelatorio: 'diario' | 'semanal' | 'mensal'
  dadosPorGN: Array<{
    executivo: string
    agencia: string
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
    detalhamentoPorDia: Array<{
      data: string
      diaSemana: string
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
        horarioCredenciamento?: string
      }>
      cnpjsSimulados: Array<{
        cnpj: string
        nomeEmpresa: string
        faturamento: number
        comentarios: string
        horarioSimulacao?: string
      }>
      resumoDia: {
        totalCredenciamentos: number
        totalVolume: number
        totalSimulacoes: number
        totalFaturamentoSimulado: number
      }
    }>
    resumoSemanal: {
      diasComCredenciamentos: number
      diasComSimulacoes: number
      gerentesPJEnvolvidos: string[]
      totalHorasTrabalhadas?: number
    }
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
    ['Total de Volume R$:', formatCurrencyUtil(data.totaisGerais.totalAtivacoes)],
    ['Total de Visitas:', data.totaisGerais.totalVisitas],
    ['Total de Interações:', data.totaisGerais.totalInteracoes],
    ['Total Bra Expre:', data.totaisGerais.totalBraExpre],
    ['Total CNPJs Simulados:', data.totaisGerais.totalCnpjsSimulados],
    ['Total Faturamento Simulado:', formatCurrencyUtil(data.totaisGerais.totalFaturamentoSimulado)],
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
      formatCurrencyUtil(gn.totalAtivacoes),
      formatCurrencyUtil(metas.volumePorSemana),
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
      ['Volume (R$)', formatCurrencyUtil(gn.totalAtivacoes), formatCurrencyUtil(metas.volumePorSemana), formatPercent(perfVolume.percentual), perfVolume.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
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
      ['Total Faturamento Simulado:', formatCurrencyUtil(gn.totalFaturamentoSimulado)],
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
        formatCurrencyUtil(totalVolume),
        totalCnpjs.toString(),
        formatCurrencyUtil(totalFaturamento)
      ])
    })

    gnData.push([''])
    gnData.push(['DETALHAMENTO DOS CREDENCIAMENTOS'])
    gnData.push(['Data', 'EC', 'Volume (R$)', 'RA', 'Qual Oferta?', 'Instala Direto', 'Gerente PJ'])

    gn.fechamentos.forEach(fechamento => {
      fechamento.credenciamentos.forEach(cred => {
        gnData.push([
          new Date(fechamento.data).toLocaleDateString('pt-BR'),
          cred.ec,
          formatCurrencyUtil(cred.volumeRS),
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
          formatCurrencyUtil(cnpj.faturamento),
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
      formatCurrencyUtil(gn.totalAtivacoes),
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

export const gerarExcelRelatorioCompleto = (data: ExcelDataCompleto) => {
  const workbook = XLSX.utils.book_new()

  // 1. RESUMO EXECUTIVO COMPLETO
  const resumoData = [
    ['🏆 RELATÓRIO COMPLETO DE PERFORMANCE - CIELO'],
    ['Período:', data.periodo],
    ['Tipo:', data.tipoRelatorio.toUpperCase()],
    ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
    ['Horário de Geração:', new Date().toLocaleTimeString('pt-BR')],
    [''],
    ['📊 RESUMO GERAL'],
    ['Total de Credenciamentos:', data.totaisGerais.totalCredenciamentos],
    ['Total de Volume R$:', formatCurrencyUtil(data.totaisGerais.totalAtivacoes)],
    ['Total de Visitas:', data.totaisGerais.totalVisitas],
    ['Total de Interações:', data.totaisGerais.totalInteracoes],
    ['Total Bra Expre:', data.totaisGerais.totalBraExpre],
    ['Total CNPJs Simulados:', data.totaisGerais.totalCnpjsSimulados],
    ['Total Faturamento Simulado:', formatCurrencyUtil(data.totaisGerais.totalFaturamentoSimulado)],
    [''],
    ['👥 PERFORMANCE POR GN'],
    ['GN', 'Agência', 'Credenciamentos', 'Meta Cred.', '% Meta Cred.', 'Volume', 'Meta Volume', '% Meta Volume', 'Visitas', 'Meta Visitas', '% Meta Visitas', 'Status Geral', 'Dias Trabalhados', 'Presença %']
  ]

  data.dadosPorGN.forEach(gn => {
    const metas = getMetasPorGN(gn.executivo)
    const perfCred = calcularPerformance(gn.totalCredenciamentos, metas.credenciamentosPorSemana)
    const perfVolume = calcularPerformance(gn.totalAtivacoes, metas.volumePorSemana)
    const perfVisitas = calcularPerformance(gn.totalVisitas, metas.visitasPorSemana)
    
    const statusGeral = (perfCred.bateuMeta && perfVolume.bateuMeta && perfVisitas.bateuMeta) ? 'META BATIDA' : 'ABAIXO DA META'
    
    resumoData.push([
      gn.executivo,
      gn.agencia,
      gn.totalCredenciamentos,
      metas.credenciamentosPorSemana,
      formatPercent(perfCred.percentual),
      formatCurrencyUtil(gn.totalAtivacoes),
      formatCurrencyUtil(metas.volumePorSemana),
      formatPercent(perfVolume.percentual),
      gn.totalVisitas,
      metas.visitasPorSemana,
      formatPercent(perfVisitas.percentual),
      statusGeral,
      gn.diasTrabalhados,
      formatPercent(gn.percentualPresenca)
    ])
  })

  const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData)
  XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo Executivo')

  // 2. DETALHAMENTO COMPLETO POR GN
  data.dadosPorGN.forEach(gn => {
    const metas = getMetasPorGN(gn.executivo)
    const perfCred = calcularPerformance(gn.totalCredenciamentos, metas.credenciamentosPorSemana)
    const perfVolume = calcularPerformance(gn.totalAtivacoes, metas.volumePorSemana)
    const perfVisitas = calcularPerformance(gn.totalVisitas, metas.visitasPorSemana)

    const gnData = [
      [`📋 DETALHAMENTO COMPLETO - ${gn.executivo.toUpperCase()}`],
      ['Agência:', gn.agencia],
      ['Período:', data.periodo],
      [''],
      ['🎯 META vs REALIZADO'],
      ['Indicador', 'Realizado', 'Meta', 'Percentual', 'Status'],
      ['Credenciamentos', gn.totalCredenciamentos, metas.credenciamentosPorSemana, formatPercent(perfCred.percentual), perfCred.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      ['Volume (R$)', formatCurrencyUtil(gn.totalAtivacoes), formatCurrencyUtil(metas.volumePorSemana), formatPercent(perfVolume.percentual), perfVolume.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      ['Visitas', gn.totalVisitas, metas.visitasPorSemana, formatPercent(perfVisitas.percentual), perfVisitas.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'],
      [''],
      ['📊 RESUMO DA SEMANA'],
      ['Dias Trabalhados:', gn.diasTrabalhados],
      ['Dias Esperados:', gn.diasEsperados],
      ['Percentual de Presença:', formatPercent(gn.percentualPresenca)],
      ['Média Credenciamentos/Dia:', gn.mediaCredenciamentosPorDia.toFixed(2)],
      ['Média Visitas/Dia:', gn.mediaVisitasPorDia.toFixed(2)],
      ['Total Interações:', gn.totalInteracoes],
      ['Total Bra Expre:', gn.totalBraExpre],
      ['Total CNPJs Simulados:', gn.totalCnpjsSimulados],
      ['Total Faturamento Simulado:', formatCurrencyUtil(gn.totalFaturamentoSimulado)],
      [''],
      ['📅 DETALHAMENTO POR DIA DA SEMANA'],
      ['Data', 'Dia da Semana', 'Agência', 'Visitas', 'Interações', 'Bra Expre', 'Credenciamentos', 'Volume Cred.', 'Simulações', 'Faturamento Sim.']
    ]

    gn.detalhamentoPorDia.forEach(dia => {
      gnData.push([
        new Date(dia.data).toLocaleDateString('pt-BR'),
        dia.diaSemana,
        dia.agencia,
        dia.qtdVisitas.toString(),
        dia.qtdInteracoes.toString(),
        dia.qtdBraExpre.toString(),
        dia.resumoDia.totalCredenciamentos.toString(),
        formatCurrency(dia.resumoDia.totalVolume),
        dia.resumoDia.totalSimulacoes.toString(),
        formatCurrency(dia.resumoDia.totalFaturamentoSimulado)
      ])
    })

    gnData.push([''])
    gnData.push(['📝 DETALHAMENTO COMPLETO DOS CREDENCIAMENTOS'])
    gnData.push(['Data', 'Dia da Semana', 'EC', 'Volume (R$)', 'RA', 'Qual Oferta?', 'Instala Direto', 'Gerente PJ', 'Horário'])

    gn.detalhamentoPorDia.forEach(dia => {
      dia.credenciamentos.forEach(cred => {
        gnData.push([
          new Date(dia.data).toLocaleDateString('pt-BR'),
          dia.diaSemana,
          cred.ec,
          formatCurrencyUtil(cred.volumeRS),
          cred.ra ? 'Sim' : 'Não',
          cred.cesta,
          cred.instalaDireto ? 'Sim' : 'Não',
          cred.nomeGerentePJ || '-',
          cred.horarioCredenciamento || '-'
        ])
      })
    })

    gnData.push([''])
    gnData.push(['🔍 DETALHAMENTO COMPLETO DAS SIMULAÇÕES'])
    gnData.push(['Data', 'Dia da Semana', 'CNPJ', 'Empresa', 'Faturamento (R$)', 'Comentários', 'Horário'])

    gn.detalhamentoPorDia.forEach(dia => {
      dia.cnpjsSimulados.forEach(cnpj => {
        gnData.push([
          new Date(dia.data).toLocaleDateString('pt-BR'),
          dia.diaSemana,
          cnpj.cnpj,
          cnpj.nomeEmpresa,
          formatCurrencyUtil(cnpj.faturamento),
          cnpj.comentarios || '-',
          cnpj.horarioSimulacao || '-'
        ])
      })
    })

    gnData.push([''])
    gnData.push(['👥 ANÁLISE DOS GERENTES PJ'])
    gnData.push(['Gerente PJ', 'Total Credenciamentos', 'Total Volume (R$)'])

    // Agrupar por gerente PJ
    const gerentesPJ: { [key: string]: { credenciamentos: number, volume: number } } = {}
    
    gn.detalhamentoPorDia.forEach(dia => {
      dia.credenciamentos.forEach(cred => {
        if (cred.nomeGerentePJ) {
          if (!gerentesPJ[cred.nomeGerentePJ]) {
            gerentesPJ[cred.nomeGerentePJ] = { credenciamentos: 0, volume: 0 }
          }
          gerentesPJ[cred.nomeGerentePJ].credenciamentos++
          gerentesPJ[cred.nomeGerentePJ].volume += cred.volumeRS
        }
      })
    })

    Object.entries(gerentesPJ).forEach(([nome, dados]) => {
      gnData.push([
        nome,
        dados.credenciamentos.toString(),
        formatCurrencyUtil(dados.volume)
      ])
    })

    gnData.push([''])
    gnData.push(['📊 RESUMO SEMANAL AVANÇADO'])
    gnData.push(['Dias com Credenciamentos:', gn.resumoSemanal.diasComCredenciamentos])
    gnData.push(['Dias com Simulações:', gn.resumoSemanal.diasComSimulacoes])
    gnData.push(['Gerentes PJ Envolvidos:', gn.resumoSemanal.gerentesPJEnvolvidos.join(', ')])
    if (gn.resumoSemanal.totalHorasTrabalhadas) {
      gnData.push(['Total Horas Trabalhadas:', gn.resumoSemanal.totalHorasTrabalhadas])
    }

    const gnSheet = XLSX.utils.aoa_to_sheet(gnData)
    XLSX.utils.book_append_sheet(workbook, gnSheet, gn.executivo)
  })

  // 3. ANÁLISE COMPARATIVA E RANKING
  const comparativoData = [
    ['🏆 ANÁLISE COMPARATIVA E RANKING COMPLETO'],
    ['Período:', data.periodo],
    [''],
    ['🥇 RANKING POR CREDENCIAMENTOS'],
    ['Posição', 'GN', 'Agência', 'Credenciamentos', 'Meta', '% Meta', 'Status', 'Dias Trabalhados']
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
      gn.agencia,
      gn.totalCredenciamentos.toString(),
      gn.metas.credenciamentosPorSemana.toString(),
      formatPercent(gn.performance.percentual),
      gn.performance.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META',
      gn.diasTrabalhados.toString()
    ])
  })

  comparativoData.push([''])
  comparativoData.push(['💰 RANKING POR VOLUME'])
  comparativoData.push(['Posição', 'GN', 'Agência', 'Volume (R$)', 'Meta (R$)', '% Meta', 'Status', 'Dias Trabalhados'])

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
      gn.agencia,
      formatCurrencyUtil(gn.totalAtivacoes),
      formatCurrency(gn.metas.volumePorSemana),
      formatPercent(gn.performance.percentual),
      gn.performance.bateuMeta ? 'META BATIDA' : 'ABAIXO DA META',
      gn.diasTrabalhados.toString()
    ])
  })

  comparativoData.push([''])
  comparativoData.push(['📊 ANÁLISE DE FREQUÊNCIA'])
  comparativoData.push(['GN', 'Agência', 'Dias Trabalhados', 'Presença %', 'Média Cred/Dia', 'Média Visitas/Dia'])

  data.dadosPorGN.forEach(gn => {
    comparativoData.push([
      gn.executivo,
      gn.agencia,
      gn.diasTrabalhados.toString(),
      formatPercent(gn.percentualPresenca),
      gn.mediaCredenciamentosPorDia.toFixed(2),
      gn.mediaVisitasPorDia.toFixed(2)
    ])
  })

  const comparativoSheet = XLSX.utils.aoa_to_sheet(comparativoData)
  XLSX.utils.book_append_sheet(workbook, comparativoSheet, 'Análise Comparativa')

  // 4. PLANILHA DE CRONOGRAMA SEMANAL
  const cronogramaData = [
    ['📅 CRONOGRAMA SEMANAL DETALHADO'],
    ['Período:', data.periodo],
    [''],
    ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  ]

  // Criar grid semanal
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const cronogramaGrid = [['GN', ...diasSemana]]

  data.dadosPorGN.forEach(gn => {
    const linha = [gn.executivo]
    
    diasSemana.forEach(dia => {
      const dadosDia = gn.detalhamentoPorDia.find(d => d.diaSemana === dia)
      if (dadosDia) {
        linha.push(`${dadosDia.resumoDia.totalCredenciamentos} creds\n${dadosDia.qtdVisitas} visitas`)
      } else {
        linha.push('-')
      }
    })
    
    cronogramaGrid.push(linha)
  })

  cronogramaData.push(...cronogramaGrid)

  const cronogramaSheet = XLSX.utils.aoa_to_sheet(cronogramaData)
  XLSX.utils.book_append_sheet(workbook, cronogramaSheet, 'Cronograma Semanal')

  // Gerar nome do arquivo
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `relatorio-completo-${data.tipoRelatorio}-${timestamp}.xlsx`

  // Salvar arquivo
  XLSX.writeFile(workbook, filename)

  return filename
}
