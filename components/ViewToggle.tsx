'use client'

import React from 'react'
import { BarChart3, List, Eye } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'

interface ViewToggleProps {
  view: 'single' | 'comparison'
  onViewChange: (view: 'single' | 'comparison') => void
  processCount: number
  hasActiveProcess: boolean
}

export function ViewToggle({ view, onViewChange, processCount, hasActiveProcess }: ViewToggleProps) {
  const views = [
    {
      key: 'single' as const,
      label: 'Single Process',
      icon: Eye,
      description: 'View detailed analysis for one process',
      disabled: !hasActiveProcess,
    },
    {
      key: 'comparison' as const,
      label: 'Compare Processes',
      icon: BarChart3,
      description: 'Side-by-side comparison table',
      disabled: processCount < 2,
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-2">Analysis View</h4>
            <div className="flex flex-wrap gap-1">
              {views.map((viewOption) => {
                const Icon = viewOption.icon
                const isActive = view === viewOption.key
                const isDisabled = viewOption.disabled

                return (
                  <Button
                    key={viewOption.key}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => !isDisabled && onViewChange(viewOption.key)}
                    disabled={isDisabled}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {viewOption.label}
                    {viewOption.key === 'comparison' && processCount >= 2 && (
                      <Badge variant="secondary" className="ml-1">
                        {processCount}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-6 sm:pt-8">
            {view === 'single' && hasActiveProcess && 'Detailed analysis for selected process'}
            {view === 'comparison' && processCount >= 2 && `Comparing ${processCount} processes`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}