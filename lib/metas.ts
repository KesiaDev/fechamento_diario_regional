// Configuração das metas individuais por GN
// Metas unificadas: 10 credenciamentos e 30 visitas por semana (segunda a sexta)

// Metas padrão aplicadas a todos os GNs
const metaPadrao = {
  credenciamentosPorSemana: 10, // 10 mínimos por semana (segunda a sexta)
  volumePorSemana: 150000, // R$ 150.000 por semana
  credenciamentosPorDia: 2,
  visitasPorDia: 6,
  visitasPorSemana: 30 // 6 por dia x 5 dias úteis
}

// Lista de todos os GNs para garantir que todos tenham metas definidas
const todosGNs = [
  // EQUIPE KESIA WEIGE NANDI
  'Sheila', 'Jeferson', 'Jhonattan', 'Renan', 'Dionei', 'Cristian',
  // EQUIPE AMANDA ALINE TRINDADE JUSTI
  'Vitor Hugo', 'Wagner', 'Patricia', 'Augusto', 'Tiago', 'Abner', 'Ana C Silva',
  // EQUIPE ADRIANO CORREA GOMES
  'Vander', 'In Koo', 'Fabio', 'Henrique', 'Paulo', 'Carlos', 'Tba Exe 1 - Cascavel',
  // EQUIPE BRUNA PASSOS LEMES
  'Raymi', 'William', 'Adler', 'Willyam', 'Alexsandro', 'Cristian Alfonso', 'Kelvin', 'Willian', 'Tba Exe 2 - Blumenau',
  // EQUIPE GUILHERME MORAES DORNEMANN
  'Ricardo', 'Paola', 'Josimar', 'Edson', 'Fabiele', 'Sabrina', 'Tba Exe 2 - Porto_Alegre_Norte',
  // EQUIPE TBA ESTADUAL BRA PARANA 2
  'Joslayne', 'Lyon', 'Elisandra', 'Lilian', 'Nicodemos',
  'Tba Exe 1 - Curitiba_Norte', 'Tba Exe 1 - Curitiba_Sul',
  'Tba Exe 2 - Curitiba_Sul', 'Tba Exe 4 - Curitiba_Norte'
]

// Criar objeto de metas para todos os GNs
export const metasIndividuais = todosGNs.reduce((acc, gn) => {
  acc[gn] = metaPadrao
  return acc
}, {} as Record<string, typeof metaPadrao>)

// Função para obter metas de um GN específico
export function getMetasPorGN(gn: string) {
  return metasIndividuais[gn] || metaPadrao
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
