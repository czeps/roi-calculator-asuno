'use client'

import React, { useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { generateRisksAndMitigations } from '@/lib/report'

interface Risk {
  risk: string
  mitigation: string
  severity: 'low' | 'medium' | 'high'
}

export function RisksCard() {
  const [risks, setRisks] = useState<Risk[]>(generateRisksAndMitigations())
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingRisk({ ...risks[index] })
  }

  const handleSave = () => {
    if (editingIndex !== null && editingRisk) {
      const newRisks = [...risks]
      newRisks[editingIndex] = editingRisk
      setRisks(newRisks)
      setEditingIndex(null)
      setEditingRisk(null)
    }
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditingRisk(null)
  }

  const handleDelete = (index: number) => {
    const newRisks = risks.filter((_, i) => i !== index)
    setRisks(newRisks)
  }

  const handleAdd = () => {
    const newRisk: Risk = {
      risk: '',
      mitigation: '',
      severity: 'medium',
    }
    setRisks([...risks, newRisk])
    setEditingIndex(risks.length)
    setEditingRisk(newRisk)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Risks & Mitigations</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {risks.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            {editingIndex === index ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Risk</label>
                  <Input
                    value={editingRisk?.risk || ''}
                    onChange={(e) => setEditingRisk(prev => prev ? { ...prev, risk: e.target.value } : null)}
                    placeholder="Describe the risk..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mitigation</label>
                  <Textarea
                    value={editingRisk?.mitigation || ''}
                    onChange={(e) => setEditingRisk(prev => prev ? { ...prev, mitigation: e.target.value } : null)}
                    placeholder="How to mitigate this risk..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <Select
                    value={editingRisk?.severity || 'medium'}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setEditingRisk(prev => prev ? { ...prev, severity: value } : null)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-2">{item.risk}</h4>
                    <p className="text-sm text-muted-foreground">{item.mitigation}</p>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        {risks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No risks identified yet.</p>
            <Button variant="outline" onClick={handleAdd} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add your first risk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}