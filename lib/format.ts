import { CURRENCIES } from './constants'

export function formatCurrency(
  amount: number,
  currencyCode: string,
  options: { minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode)
  const symbol = currency?.symbol || '$'

  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Math.abs(amount))

  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatHours(hours: number, decimals: number = 1): string {
  return `${hours.toFixed(decimals)}h`
}

export function formatFTE(fte: number, decimals: number = 2): string {
  return `${fte.toFixed(decimals)} FTE`
}

export function formatMonths(months: number, decimals: number = 1): string {
  if (months < 0) return 'N/A'
  if (months > 100) return '100+ months'
  return `${months.toFixed(decimals)} months`
}