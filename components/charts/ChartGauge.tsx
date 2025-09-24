'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatMonths } from '@/lib/format'
import type { CalculationResults } from '@/lib/calcs'

interface ChartGaugeProps {
  results: CalculationResults
}

export function ChartGauge({ results }: ChartGaugeProps) {
  const paybackMonths = results.scenarios.real.paybackMonths
  const clampedPayback = Math.min(Math.max(paybackMonths, 0), 36)
  const percentage = (clampedPayback / 36) * 100

  const data = [
    { name: 'Payback', value: percentage, fill: '#3b82f6' },
    { name: 'Remaining', value: 100 - percentage, fill: '#e5e7eb' },
  ]

  const getPaybackColor = (months: number) => {
    if (months <= 6) return '#10b981' // Green
    if (months <= 12) return '#f59e0b' // Yellow
    if (months <= 24) return '#ef4444' // Red
    return '#64748b' // Gray
  }

  const getPaybackLabel = (months: number) => {
    if (months <= 6) return 'Excellent'
    if (months <= 12) return 'Good'
    if (months <= 24) return 'Fair'
    return 'Poor'
  }

  const gaugeData = [
    { name: 'progress', value: Math.min(percentage, 100), fill: getPaybackColor(paybackMonths) },
    { name: 'remaining', value: Math.max(0, 100 - percentage), fill: '#f1f5f9' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payback Period</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold" style={{ color: getPaybackColor(paybackMonths) }}>
              {formatMonths(paybackMonths)}
            </div>
            <div className="text-sm text-muted-foreground">
              {getPaybackLabel(paybackMonths)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>0 months</span>
          <span>18 months</span>
          <span>36+ months</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-xs text-green-600">Excellent</span>
          <span className="text-xs text-yellow-600">Fair</span>
          <span className="text-xs text-red-600">Poor</span>
        </div>
      </CardContent>
    </Card>
  )
}