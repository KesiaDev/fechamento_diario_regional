'use client'

import { formatCurrency } from '@/lib/utils'

interface QuadroKesiaNandiProps {
  totaisGerais: {
    totalCredenciamentos: number
    totalAtivacoes: number
    totalVisitas: number
    totalInteracoes: number
    totalBraExpre: number
    totalCnpjsSimulados: number
    totalFaturamentoSimulado: number
  }
  data: string
  tipoRelatorio: 'diario' | 'semanal' | 'mensal'
}

export function QuadroKesiaNandi({ totaisGerais, data, tipoRelatorio }: QuadroKesiaNandiProps) {
  const getTipoTexto = () => {
    switch (tipoRelatorio) {
      case 'diario':
        return 'Relatório Diário'
      case 'semanal':
        return 'Relatório Semanal'
      case 'mensal':
        return 'Relatório Mensal'
      default:
        return 'Relatório'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img
            src={`/fotos/Kesia.jpeg?v=${Date.now()}`}
            alt="Francielen"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement
              // Tenta outras extensões comuns antes de desistir
              if (!img.dataset.tryjpg) {
                img.dataset.tryjpg = '1'
                img.src = '/fotos/Kesia.jpg'
                return
              }
              if (!img.dataset.trypng) {
                img.dataset.trypng = '1'
                img.src = '/fotos/Kesia.png'
                return
              }
              // Se nenhuma existir, mantém um avatar de fallback simples
              img.style.display = 'none'
              const parent = img.parentElement
              if (parent) {
                const fallback = document.createElement('div')
                fallback.className = 'w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold'
                fallback.textContent = 'K'
                parent.appendChild(fallback)
              }
            }}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Acumulado Regional — Francielen</h3>
            <p className="text-sm text-gray-600">Gerente Estadual • {data} • {getTipoTexto()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-600 font-medium">Credenciamentos</p>
          <p className="text-xl font-bold text-blue-700">{totaisGerais.totalCredenciamentos}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-xs text-green-600 font-medium">Volume R$</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(totaisGerais.totalAtivacoes)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-xs text-purple-600 font-medium">Visitas</p>
          <p className="text-xl font-bold text-purple-700">{totaisGerais.totalVisitas}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-xs text-orange-600 font-medium">Interações</p>
          <p className="text-xl font-bold text-orange-700">{totaisGerais.totalInteracoes}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 font-medium">CNPJs Simulados</p>
          <p className="text-xl font-bold text-gray-700">{totaisGerais.totalCnpjsSimulados}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <p className="text-xs text-pink-600 font-medium">Faturamento Simulado</p>
          <p className="text-xl font-bold text-pink-700">{formatCurrency(totaisGerais.totalFaturamentoSimulado)}</p>
        </div>
      </div>
    </div>
  )
}
