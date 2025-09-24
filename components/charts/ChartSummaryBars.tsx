'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '@/lib/format'
import type { CalculationResults } from '@/lib/calcs'

interface ChartSummaryBarsProps {
  results: CalculationResults
  currency: string
}

export function ChartSummaryBars({ results, currency }: ChartSummaryBarsProps) {
  const data = [
    {
      name: 'Baseline',
      value: results.baseline.annualCost,
      fill: '#64748b',
    },
    {
      name: 'Pessimistic',
      value: results.scenarios.pess.netSavingsAnnual,
      fill: '#ef4444',
    },
    {
      name: 'Realistic',
      value: results.scenarios.real.netSavingsAnnual,
      fill: '#3b82f6',
    },
    {
      name: 'Optimistic',
      value: results.scenarios.opt.netSavingsAnnual,
      fill: '#10b981',
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            {label === 'Baseline' ? 'Annual Cost: ' : 'Net Savings: '}
            <span className="font-semibold">
              {formatCurrency(payload[0].value, currency)}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Impact Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, currency, { maximumFractionDigits: 0 })}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                fill="currentColor"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}