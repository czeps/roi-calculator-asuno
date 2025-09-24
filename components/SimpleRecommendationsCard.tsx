'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency, formatPercent, formatMonths } from '@/lib/format'
import type { RoiCalculatorFormData } from '@/lib/schemas'
import type { CalculationResults } from '@/lib/calcs'

interface SimpleRecommendationsCardProps {
  data: RoiCalculatorFormData
  results: CalculationResults
}

export function SimpleRecommendationsCard({ data, results }: SimpleRecommendationsCardProps) {
  const { real } = results.scenarios

  const getRecommendation = () => {
    if (real.roi > 2) {
      return {
        title: "Strong Investment Opportunity",
        text: "This automation shows excellent returns and should be prioritized for implementation.",
        color: "text-green-600"
      }
    } else if (real.roi > 1) {
      return {
        title: "Good Investment Opportunity",
        text: "This automation provides solid returns and is recommended for implementation.",
        color: "text-green-600"
      }
    } else if (real.roi > 0.5) {
      return {
        title: "Moderate Investment Opportunity",
        text: "This automation provides moderate returns. Consider optimizing scope or timing.",
        color: "text-yellow-600"
      }
    } else if (real.roi > 0) {
      return {
        title: "Low Investment Opportunity",
        text: "This automation provides limited returns. Consider alternative approaches.",
        color: "text-orange-600"
      }
    } else {
      return {
        title: "Not Recommended",
        text: "Current projections show negative returns. Reassess requirements and approach.",
        color: "text-red-600"
      }
    }
  }

  const recommendation = getRecommendation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg mb-3">Current Situation</h4>
          <p className="text-sm text-muted-foreground">
            Your team of {data.people} people spends {data.hoursPerWeekPerPerson} hours per week each on this process,
            costing approximately {formatCurrency(results.baseline.annualCost, data.currency)} annually.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Automation Impact</h4>
          <p className="text-sm text-muted-foreground">
            By automating {data.automationPct.real}% of this work, you could save{' '}
            {formatCurrency(real.totalSavingsAnnual, data.currency)} per year after accounting for
            implementation costs of {formatCurrency(data.implOneOff, data.currency)} and monthly
            running costs of {formatCurrency(data.runMonthly, data.currency)}.
          </p>
        </div>

        <div>
          <h4 className={`font-semibold text-lg mb-3 ${recommendation.color}`}>{recommendation.title}</h4>
          <p className="text-sm text-muted-foreground mb-4">
            {recommendation.text}
          </p>

          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Return on Investment</p>
              <p className={`text-lg font-semibold ${recommendation.color}`}>
                {formatPercent(real.roi)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payback Period</p>
              <p className={`text-lg font-semibold ${recommendation.color}`}>
                {formatMonths(real.paybackMonths)}
              </p>
            </div>
          </div>
        </div>

        {real.roi > 0.5 && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Next Steps</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Validate these assumptions with your team</li>
              <li>• Identify specific automation tools or solutions</li>
              <li>• Create a detailed implementation plan</li>
              <li>• Start with a small pilot to test the approach</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}