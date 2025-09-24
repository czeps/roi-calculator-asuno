'use client'

import React from 'react'
import { DollarSign, TrendingUp, Clock, Users, Target } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { formatCurrency, formatPercent, formatMonths, formatFTE } from '@/lib/format'
import type { CalculationResults } from '@/lib/calcs'

interface KpiStripProps {
  results: CalculationResults
  currency: string
}

export function KpiStrip({ results, currency }: KpiStripProps) {
  const { baseline, scenarios } = results
  const { real } = scenarios

  const kpis = [
    {
      title: 'Current Annual Cost',
      value: formatCurrency(baseline.annualCost, currency),
      icon: DollarSign,
      color: 'text-slate-600',
    },
    {
      title: 'Annual Savings',
      value: formatCurrency(real.netSavingsAnnual, currency),
      icon: Target,
      color: real.netSavingsAnnual > 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Return on Investment',
      value: formatPercent(real.roi),
      icon: TrendingUp,
      color: real.roi > 1 ? 'text-green-600' : real.roi > 0.5 ? 'text-yellow-600' : 'text-red-600',
    },
    {
      title: 'Payback Period',
      value: formatMonths(real.paybackMonths),
      icon: Clock,
      color: real.paybackMonths <= 12 ? 'text-green-600' : real.paybackMonths <= 24 ? 'text-yellow-600' : 'text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`rounded-md p-1.5 bg-slate-100 dark:bg-slate-800 flex-shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${kpi.color}`} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
                    {kpi.title}
                  </p>
                </div>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${kpi.color} leading-tight break-all`}>
                  {kpi.value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}