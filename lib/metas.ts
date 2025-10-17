// Configuração das metas individuais por GN
export const metasIndividuais = {
  'Sheila': {
    credenciamentosPorSemana: 10, // 2 por dia x 5 dias
    volumePorSemana: 150000, // R$ 150.000 por semana
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30 // 6 por dia x 5 dias
  },
  'Jeferson': {
    credenciamentosPorSemana: 10,
    volumePorSemana: 150000,
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30
  },
  'Jhonattan': {
    credenciamentosPorSemana: 10,
    volumePorSemana: 150000,
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30
  },
  'Renan': {
    credenciamentosPorSemana: 10,
    volumePorSemana: 150000,
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30
  },
  'Dionei': {
    credenciamentosPorSemana: 10,
    volumePorSemana: 150000,
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30
  },
  'Cristian': {
    credenciamentosPorSemana: 10,
    volumePorSemana: 150000,
    credenciamentosPorDia: 2,
    visitasPorDia: 6,
    visitasPorSemana: 30
  }
}

// Função para obter metas de um GN específico
export function getMetasPorGN(gn: string) {
  return metasIndividuais[gn as keyof typeof metasIndividuais] || metasIndividuais.Sheila
}

// Função para calcular performance vs meta
export function calcularPerformance(real: number, meta: number) {
  const percentual = meta > 0 ? (real / meta) * 100 : 0
  const bateuMeta = real >= meta
  const diferenca = real - meta
  
  return {
    percentual: Math.round(percentual * 100) / 100,
    bateuMeta,
    diferenca,
    status: bateuMeta ? 'META BATIDA' : 'ABAIXO DA META'
  }
}

// Função para formatar moeda
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para formatar percentual
export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}
