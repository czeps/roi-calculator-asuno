'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { formatPercent } from '@/lib/format'
import { calculateSensitivityAnalysis, type SensitivityData } from '@/lib/sensitivity'
import type { RoiCalculatorFormData } from '@/lib/schemas'

interface ChartTornadoProps {
  data: RoiCalculatorFormData
}

export function ChartTornado({ data }: ChartTornadoProps) {
  const sensitivityData = calculateSensitivityAnalysis(data)

  const chartData = sensitivityData
    .sort((a, b) => Math.abs(b.positive - b.negative) - Math.abs(a.positive - a.negative))
    .map(item => ({
      name: item.name,
      negative: item.negative,
      positive: item.positive,
      range: Math.abs(item.positive - item.negative),
    }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const negativePayload = payload.find((p: any) => p.dataKey === 'negative')
      const positivePayload = payload.find((p: any) => p.dataKey === 'positive')

      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-red-600">
            -10%: {formatPercent(negativePayload?.value || 0, 2)} ROI impact
          </p>
          <p className="text-sm text-green-600">
            +10%: {formatPercent(positivePayload?.value || 0, 2)} ROI impact
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensitivity Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Impact of ±10% change in key variables on ROI
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="verticalLayout"
              margin={{
                top: 20,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatPercent(value, 1)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="negative" stackId="a" fill="#ef4444" radius={[2, 0, 0, 2]} />
              <Bar dataKey="positive" stackId="a" fill="#10b981" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}