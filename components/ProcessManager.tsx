'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Copy, Edit2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { formatCurrency, formatPercent } from '@/lib/format'
import { calculateAll } from '@/lib/calcs'
import type { RoiCalculatorFormData } from '@/lib/schemas'

interface Process extends RoiCalculatorFormData {
  id: string
  name: string
}

interface ProcessManagerProps {
  processes: Process[]
  activeProcessId: string | null
  onProcessSelect: (processId: string) => void
  onProcessAdd: () => void
  onProcessDuplicate: (processId: string) => void
  onProcessDelete: (processId: string) => void
}

export function ProcessManager({
  processes,
  activeProcessId,
  onProcessSelect,
  onProcessAdd,
  onProcessDuplicate,
  onProcessDelete,
}: ProcessManagerProps) {
  const getTotalSavings = () => {
    return processes.reduce((total, process) => {
      const results = calculateAll(process)
      return total + results.scenarios.real.netSavingsAnnual
    }, 0)
  }

  const currency = processes[0]?.currency || 'USD'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Processes ({processes.length})</CardTitle>
            {processes.length > 1 && (
              <p className="text-sm text-muted-foreground mt-1">
                Total potential savings: {formatCurrency(getTotalSavings(), currency)}
              </p>
            )}
          </div>
          <Button onClick={onProcessAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Process
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {processes.map((process) => {
            const results = calculateAll(process)
            const isActive = activeProcessId === process.id

            return (
              <div
                key={process.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onProcessSelect(process.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">
                        {process.processDescription || `Process ${processes.indexOf(process) + 1}`}
                      </h4>
                      {isActive && (
                        <Badge variant="default" className="text-xs px-2 py-0">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{process.people} people</span>
                      <span>{process.hoursPerWeekPerPerson}h/week each</span>
                      <span className={results.scenarios.real.roi > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercent(results.scenarios.real.roi)} ROI
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onProcessDuplicate(process.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {processes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onProcessDelete(process.id)
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}