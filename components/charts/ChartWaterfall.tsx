'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatCurrency } from '@/lib/format'
import type { CalculationResults } from '@/lib/calcs'

interface ChartWaterfallProps {
  results: CalculationResults
  currency: string
}

export function ChartWaterfall({ results, currency }: ChartWaterfallProps) {
  const { baseline, scenarios } = results
  const { real } = scenarios

  const data = [
    {
      name: 'Baseline Cost',
      value: baseline.annualCost,
      cumulative: baseline.annualCost,
      type: 'baseline',
      color: '#64748b',
    },
    {
      name: 'Labor Savings',
      value: -real.laborSavingsAnnual,
      cumulative: baseline.annualCost - real.laborSavingsAnnual,
      type: 'savings',
      color: '#10b981',
    },
    {
      name: 'Quality Savings',
      value: -real.qualitySavingsAnnual,
      cumulative: baseline.annualCost - real.laborSavingsAnnual - real.qualitySavingsAnnual,
      type: 'savings',
      color: '#06b6d4',
    },
    {
      name: 'Implementation',
      value: real.implAnnual,
      cumulative: baseline.annualCost - real.laborSavingsAnnual - real.qualitySavingsAnnual + real.implAnnual,
      type: 'cost',
      color: '#ef4444',
    },
    {
      name: 'Net Result',
      value: baseline.annualCost - real.totalSavingsAnnual + real.implAnnual,
      cumulative: baseline.annualCost - real.totalSavingsAnnual + real.implAnnual,
      type: 'result',
      color: real.netSavingsAnnual > 0 ? '#10b981' : '#ef4444',
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Value: <span className="font-semibold">{formatCurrency(Math.abs(data.value), currency)}</span>
          </p>
          <p className="text-sm">
            Cumulative: <span className="font-semibold">{formatCurrency(data.cumulative, currency)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waterfall Analysis (Realistic Scenario)</CardTitle>
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
                tick={{ fontSize: 11 }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value, currency, { maximumFractionDigits: 0 })}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[2, 2, 2, 2]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}