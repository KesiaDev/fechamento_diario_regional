// Configuração das agências por executivo
export const agenciasPorExecutivo = {
  'Sheila': [
    { codigo: '1775', nome: 'Farroupilha' },
    { codigo: '2869', nome: 'Marquês' },
    { codigo: '2176', nome: 'Pio X' },
    { codigo: '2162', nome: 'Flores da Cunha' },
    { codigo: '269', nome: 'Caxias Centro' },
    { codigo: '1619', nome: 'S. Marcos' },
    { codigo: '1778', nome: 'Torres' }
  ],
  'Jeferson': [
    { codigo: '2954', nome: 'Guaporé' },
    { codigo: '908', nome: 'Nova Prata' },
    { codigo: '2382', nome: 'Lagoa Vermelha' },
    { codigo: '1571', nome: 'Marau' },
    { codigo: '3153', nome: 'Passo Fundo' },
    { codigo: '3274', nome: 'Erechim' },
    { codigo: '1393', nome: 'Vacaria' },
    { codigo: '1900', nome: 'Soledade' }
  ],
  'Jhonattan': [
    { codigo: '1590', nome: 'Canela' },
    { codigo: '1797', nome: 'Gramado' },
    { codigo: '2166', nome: 'Estrela' },
    { codigo: '1779', nome: 'Garibaldi' },
    { codigo: '1636', nome: 'Encantado' },
    { codigo: '3269', nome: 'Bento Gonçalves' },
    { codigo: '563', nome: 'Lajeado' }
  ],
  'Renan': [
    { codigo: '1596', nome: 'Frederico Westphalen' },
    { codigo: '1674', nome: 'Panambi' },
    { codigo: '3276', nome: 'Sta. Rosa' },
    { codigo: '3275', nome: 'Ijuí' },
    { codigo: '1534', nome: 'V2' },
    { codigo: '3272', nome: 'Carazinho' },
    { codigo: '1798', nome: 'S. Luiz Gonzaga' },
    { codigo: '3277', nome: 'Sto. Angelo' },
    { codigo: '1252', nome: 'Palmeira das Missões' }
  ],
  'Dionei': [
    { codigo: '1587', nome: 'Sta. Cruz do Sul' },
    { codigo: '1299', nome: 'Não-Me-Toque' },
    { codigo: '2074', nome: 'Venâncio Aires' },
    { codigo: '3270', nome: 'Cachoeira do Sul' },
    { codigo: '3273', nome: 'Cruz Alta' },
    { codigo: '1532', nome: 'Ibirubá' },
    { codigo: '388', nome: 'Santa Maria' }
  ],
  'Cristian': [
    { codigo: '3159', nome: 'Uruguaiana' },
    { codigo: '1635', nome: 'Dom Pedrito' },
    { codigo: '1306', nome: 'Rosário do Sul' },
    { codigo: '1649', nome: 'Santiago' },
    { codigo: '3278', nome: 'São Borja' },
    { codigo: '3268', nome: 'Alegrete' },
    { codigo: '3157', nome: 'Santana do Livramento' },
    { codigo: '0439', nome: 'Bagé' },
    { codigo: '3279', nome: 'São Gabriel' },
    { codigo: '1533', nome: 'S. Sepé' }
  ]
}

// Função para obter agências de um executivo específico
export function getAgenciasPorExecutivo(executivo: string) {
  return agenciasPorExecutivo[executivo as keyof typeof agenciasPorExecutivo] || []
}

// Função para obter todas as agências em formato de string para exibição
export function getAgenciasFormatadas(executivo: string) {
  const agencias = getAgenciasPorExecutivo(executivo)
  return agencias.map(ag => `${ag.codigo} - ${ag.nome}`)
}

// Lista de todos os executivos
export const executivos = Object.keys(agenciasPorExecutivo)
