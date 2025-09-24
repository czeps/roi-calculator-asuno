'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency, formatPercent, formatMonths, formatFTE, formatNumber } from '@/lib/format'
import type { CalculationResults } from '@/lib/calcs'

interface ScenarioTableProps {
  results: CalculationResults
  currency: string
}

export function ScenarioTable({ results, currency }: ScenarioTableProps) {
  const { scenarios } = results

  const rows = [
    {
      label: 'Time Saved (hours/week)',
      pess: formatNumber(scenarios.pess.timeSavedHoursWeek, 1),
      real: formatNumber(scenarios.real.timeSavedHoursWeek, 1),
      opt: formatNumber(scenarios.opt.timeSavedHoursWeek, 1),
    },
    {
      label: 'Labor Savings (weekly)',
      pess: formatCurrency(scenarios.pess.laborSavingsWeek, currency),
      real: formatCurrency(scenarios.real.laborSavingsWeek, currency),
      opt: formatCurrency(scenarios.opt.laborSavingsWeek, currency),
    },
    {
      label: 'Quality Savings (weekly)',
      pess: formatCurrency(scenarios.pess.qualitySavingsWeek, currency),
      real: formatCurrency(scenarios.real.qualitySavingsWeek, currency),
      opt: formatCurrency(scenarios.opt.qualitySavingsWeek, currency),
    },
    {
      label: 'Total Savings (weekly)',
      pess: formatCurrency(scenarios.pess.totalSavingsWeek, currency),
      real: formatCurrency(scenarios.real.totalSavingsWeek, currency),
      opt: formatCurrency(scenarios.opt.totalSavingsWeek, currency),
    },
    {
      label: 'Total Savings (annual)',
      pess: formatCurrency(scenarios.pess.totalSavingsAnnual, currency),
      real: formatCurrency(scenarios.real.totalSavingsAnnual, currency),
      opt: formatCurrency(scenarios.opt.totalSavingsAnnual, currency),
    },
    {
      label: 'Implementation Cost (Year 1)',
      pess: formatCurrency(scenarios.pess.implAnnual, currency),
      real: formatCurrency(scenarios.real.implAnnual, currency),
      opt: formatCurrency(scenarios.opt.implAnnual, currency),
    },
    {
      label: 'Net Savings (Year 1)',
      pess: formatCurrency(scenarios.pess.netSavingsAnnual, currency),
      real: formatCurrency(scenarios.real.netSavingsAnnual, currency),
      opt: formatCurrency(scenarios.opt.netSavingsAnnual, currency),
    },
    {
      label: 'ROI (Year 1)',
      pess: formatPercent(scenarios.pess.roi),
      real: formatPercent(scenarios.real.roi),
      opt: formatPercent(scenarios.opt.roi),
    },
    {
      label: 'Payback Period',
      pess: formatMonths(scenarios.pess.paybackMonths),
      real: formatMonths(scenarios.real.paybackMonths),
      opt: formatMonths(scenarios.opt.paybackMonths),
    },
    {
      label: 'FTE Freed',
      pess: formatFTE(scenarios.pess.fteFreed),
      real: formatFTE(scenarios.real.fteFreed),
      opt: formatFTE(scenarios.opt.fteFreed),
    },
    {
      label: 'NPV (1 year)',
      pess: formatCurrency(scenarios.pess.npv1y, currency),
      real: formatCurrency(scenarios.real.npv1y, currency),
      opt: formatCurrency(scenarios.opt.npv1y, currency),
    },
    {
      label: 'NPV (3 years)',
      pess: formatCurrency(scenarios.pess.npv3y, currency),
      real: formatCurrency(scenarios.real.npv3y, currency),
      opt: formatCurrency(scenarios.opt.npv3y, currency),
    },
  ]

  const getValueColor = (value: string, metric: string) => {
    if (metric.includes('ROI') || metric.includes('Net Savings') || metric.includes('NPV')) {
      if (value.includes('-')) return 'text-red-600'
      if (parseFloat(value.replace(/[^\d.-]/g, '')) > 0) return 'text-green-600'
    }
    return 'text-foreground'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Metric</th>
                <th className="text-right py-3 px-4 font-semibold text-red-600">Pessimistic</th>
                <th className="text-right py-3 px-4 font-semibold text-blue-600">Realistic</th>
                <th className="text-right py-3 px-4 font-semibold text-green-600">Optimistic</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                  <td className="py-2 px-4 font-medium">{row.label}</td>
                  <td className={`py-2 px-4 text-right font-mono text-sm ${getValueColor(row.pess, row.label)}`}>
                    {row.pess}
                  </td>
                  <td className={`py-2 px-4 text-right font-mono text-sm ${getValueColor(row.real, row.label)}`}>
                    {row.real}
                  </td>
                  <td className={`py-2 px-4 text-right font-mono text-sm ${getValueColor(row.opt, row.label)}`}>
                    {row.opt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}