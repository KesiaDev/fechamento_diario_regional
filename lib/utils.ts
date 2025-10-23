import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  let d: Date
  
  if (typeof date === 'string') {
    // Para strings no formato YYYY-MM-DD, criar data sem problemas de fuso horário
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split('-').map(Number)
      d = new Date(year, month - 1, day)
    } else {
      d = new Date(date)
    }
  } else {
    d = date
  }
  
  return new Intl.DateTimeFormat('pt-BR', options).format(d)
}

