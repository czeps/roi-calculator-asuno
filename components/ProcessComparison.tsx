'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency, formatPercent, formatMonths } from '@/lib/format'
import { calculateAll } from '@/lib/calcs'
import type { RoiCalculatorFormData } from '@/lib/schemas'

interface Process extends RoiCalculatorFormData {
  id: string
  name: string
}

interface ProcessComparisonProps {
  processes: Process[]
}

export function ProcessComparison({ processes }: ProcessComparisonProps) {
  if (processes.length < 2) return null

  const processResults = processes.map(process => ({
    process,
    results: calculateAll(process)
  }))

  const currency = processes[0]?.currency || 'USD'
  const totalCurrentCost = processResults.reduce((sum, { results }) => sum + results.baseline.annualCost, 0)
  const totalSavings = processResults.reduce((sum, { results }) => sum + results.scenarios.real.netSavingsAnnual, 0)
  const averageROI = processResults.reduce((sum, { results }) => sum + results.scenarios.real.roi, 0) / processes.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Process Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Current Cost</p>
              <p className="text-lg font-semibold">{formatCurrency(totalCurrentCost, currency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Potential Savings</p>
              <p className={`text-lg font-semibold ${totalSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalSavings, currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average ROI</p>
              <p className={`text-lg font-semibold ${averageROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(averageROI)}
              </p>
            </div>
          </div>

          {/* Process Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Process</th>
                  <th className="text-right py-3 px-2 font-semibold">People</th>
                  <th className="text-right py-3 px-2 font-semibold">Current Cost</th>
                  <th className="text-right py-3 px-2 font-semibold">Savings</th>
                  <th className="text-right py-3 px-2 font-semibold">ROI</th>
                  <th className="text-right py-3 px-2 font-semibold">Payback</th>
                </tr>
              </thead>
              <tbody>
                {processResults
                  .sort((a, b) => b.results.scenarios.real.roi - a.results.scenarios.real.roi)
                  .map(({ process, results }, index) => (
                    <tr key={process.id} className={index % 2 === 0 ? 'bg-muted/25' : ''}>
                      <td className="py-2 px-2">
                        <div>
                          <p className="font-medium text-sm">
                            {process.processDescription || `Process ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {process.department}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right text-sm">
                        {process.people}
                      </td>
                      <td className="py-2 px-2 text-right text-sm font-mono">
                        {formatCurrency(results.baseline.annualCost, currency, { maximumFractionDigits: 0 })}
                      </td>
                      <td className={`py-2 px-2 text-right text-sm font-mono ${
                        results.scenarios.real.netSavingsAnnual > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(results.scenarios.real.netSavingsAnnual, currency, { maximumFractionDigits: 0 })}
                      </td>
                      <td className={`py-2 px-2 text-right text-sm font-mono ${
                        results.scenarios.real.roi > 1 ? 'text-green-600' :
                        results.scenarios.real.roi > 0.5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercent(results.scenarios.real.roi)}
                      </td>
                      <td className={`py-2 px-2 text-right text-sm font-mono ${
                        results.scenarios.real.paybackMonths <= 12 ? 'text-green-600' :
                        results.scenarios.real.paybackMonths <= 24 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatMonths(results.scenarios.real.paybackMonths)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Priority Recommendations */}
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Priority Recommendations</h4>
            <div className="space-y-2">
              {processResults
                .sort((a, b) => b.results.scenarios.real.roi - a.results.scenarios.real.roi)
                .slice(0, 3)
                .map(({ process, results }, index) => {
                  const priority = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'
                  const priorityColor = index === 0 ? 'text-green-600' : index === 1 ? 'text-yellow-600' : 'text-blue-600'

                  return (
                    <div key={process.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">
                          {process.processDescription || `Process ${index + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPercent(results.scenarios.real.roi)} ROI, {formatMonths(results.scenarios.real.paybackMonths)} payback
                        </p>
                      </div>
                      <div className={`text-sm font-semibold ${priorityColor}`}>
                        {priority} Priority
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}