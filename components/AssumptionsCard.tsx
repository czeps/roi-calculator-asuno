'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import type { RoiCalculatorFormData } from '@/lib/schemas'

interface AssumptionsCardProps {
  data: RoiCalculatorFormData
  currency: string
}

export function AssumptionsCard({ data, currency }: AssumptionsCardProps) {
  const assumptions = [
    {
      category: 'Process Details',
      items: [
        { label: 'Hours per person per week', value: `${data.hoursPerWeekPerPerson}h` },
        { label: 'Number of people involved', value: `${data.people}` },
        { label: 'Department', value: data.department },
        { label: 'Industry', value: data.industry },
      ],
    },
    {
      category: 'Financial Assumptions',
      items: [
        {
          label: 'Average salary',
          value: `${formatCurrency(data.avgSalary, data.currency)} ${data.salaryPeriod}`
        },
        { label: 'Implementation cost', value: formatCurrency(data.implOneOff, currency) },
        { label: 'Monthly running cost', value: formatCurrency(data.runMonthly, currency) },
        { label: 'Discount rate', value: formatPercent(data.discountRatePct / 100) },
      ],
    },
    {
      category: 'Quality Baseline',
      items: [
        { label: 'Current error rate', value: data.errorRatePct ? formatPercent(data.errorRatePct / 100) : 'Not specified' },
        { label: 'Rework hours per week', value: data.reworkHoursPerWeek ? `${data.reworkHoursPerWeek}h` : 'Not specified' },
      ],
    },
    {
      category: 'Automation Scenarios',
      items: [
        {
          label: 'Automation potential',
          value: `${data.automationPct.pess}% / ${data.automationPct.real}% / ${data.automationPct.opt}%`
        },
        {
          label: 'Quality improvement',
          value: `${data.qualityUpliftPct.pess}% / ${data.qualityUpliftPct.real}% / ${data.qualityUpliftPct.opt}%`
        },
      ],
    },
  ]

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'med': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Assumptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {assumptions.map((section, index) => (
          <div key={index}>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">{section.category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-mono text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Confidence Levels</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Time estimates:</span>
              <Badge className={getConfidenceColor(data.confidence.hours)}>
                {data.confidence.hours.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Salary data:</span>
              <Badge className={getConfidenceColor(data.confidence.salary)}>
                {data.confidence.salary.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Automation potential:</span>
              <Badge className={getConfidenceColor(data.confidence.automation)}>
                {data.confidence.automation.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {data.category && data.category.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Process Categories</h4>
            <div className="flex flex-wrap gap-2">
              {data.category.map((cat, index) => (
                <Badge key={index} variant="outline">
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}