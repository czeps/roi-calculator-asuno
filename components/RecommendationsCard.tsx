'use client'

import React from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { generateRecommendations, generateExecutiveSummary } from '@/lib/report'
import type { RoiCalculatorFormData } from '@/lib/schemas'
import type { CalculationResults } from '@/lib/calcs'

interface RecommendationsCardProps {
  data: RoiCalculatorFormData
  results: CalculationResults
}

export function RecommendationsCard({ data, results }: RecommendationsCardProps) {
  const recommendations = generateRecommendations(data, results)
  const executiveSummary = generateExecutiveSummary(data, results)

  const getRecommendationIcon = (text: string) => {
    if (text.includes('💡') || text.includes('✅')) return CheckCircle2
    if (text.includes('⚠️') || text.includes('❌')) return AlertTriangle
    return Info
  }

  const getRecommendationColor = (text: string) => {
    if (text.includes('💡') || text.includes('✅')) return 'text-green-600'
    if (text.includes('⚠️')) return 'text-yellow-600'
    if (text.includes('❌')) return 'text-red-600'
    return 'text-blue-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executive Summary & Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Executive Summary</h4>
          <ul className="space-y-2">
            {executiveSummary.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => {
              const Icon = getRecommendationIcon(recommendation)
              const color = getRecommendationColor(recommendation)

              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                  <div className="flex-1">
                    <p className="text-sm">
                      {recommendation.replace(/[💡✅⚠️❌🚀📅🔍]/g, '').trim()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-muted-foreground mb-3">Next Steps</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                1
              </Badge>
              <span>Validate assumptions with stakeholders and subject matter experts</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                2
              </Badge>
              <span>Develop detailed implementation roadmap with milestones</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                3
              </Badge>
              <span>Secure necessary approvals and budget allocation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                4
              </Badge>
              <span>Begin with pilot implementation to validate ROI projections</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}