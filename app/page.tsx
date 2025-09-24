'use client'

import React, { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Download, Share2, FileText, Link } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FormCard } from '@/components/FormCard'
import { KpiStrip } from '@/components/KpiStrip'
import { SimpleRecommendationsCard } from '@/components/SimpleRecommendationsCard'
import { ProcessManager } from '@/components/ProcessManager'
import { ProcessComparison } from '@/components/ProcessComparison'
import { ViewToggle } from '@/components/ViewToggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { calculateAll } from '@/lib/calcs'
import { DEFAULT_VALUES } from '@/lib/constants'
import { exportToPDF, exportToCSV, generateShareUrl, parseShareUrl } from '@/lib/export'
import { format } from 'date-fns'
import type { RoiCalculatorFormData } from '@/lib/schemas'

const STORAGE_KEY = 'roi-calculator:v1'

interface Process extends RoiCalculatorFormData {
  id: string
  name: string
}

function HomeContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [processes, setProcesses] = useState<Process[]>([])
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'single' | 'comparison'>('single')
  const [isClient, setIsClient] = useState(false)

  const activeProcess = processes.find(p => p.id === activeProcessId) || processes[0]
  const formData = activeProcess || DEFAULT_VALUES

  const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout
    return ((...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }) as T
  }

  const debouncedSave = useCallback(
    debounce((processes: Process[]) => {
      if (isClient) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ processes, activeProcessId }))
      }
    }, 150),
    [isClient, activeProcessId]
  )

  const handleFormChange = useCallback((data: RoiCalculatorFormData) => {
    if (!activeProcessId) return

    const updatedProcesses = processes.map(p =>
      p.id === activeProcessId ? { ...p, ...data } : p
    )
    setProcesses(updatedProcesses)
    debouncedSave(updatedProcesses)
  }, [activeProcessId, processes, debouncedSave])

  const generateProcessId = () => {
    return `process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleAddProcess = useCallback(() => {
    const newProcess: Process = {
      ...DEFAULT_VALUES,
      id: generateProcessId(),
      name: `Process ${processes.length + 1}`,
      processDescription: '',
    }
    const updatedProcesses = [...processes, newProcess]
    setProcesses(updatedProcesses)
    setActiveProcessId(newProcess.id)
    debouncedSave(updatedProcesses)
  }, [processes, debouncedSave])

  const handleDuplicateProcess = useCallback((processId: string) => {
    const originalProcess = processes.find(p => p.id === processId)
    if (!originalProcess) return

    const duplicatedProcess: Process = {
      ...originalProcess,
      id: generateProcessId(),
      name: `${originalProcess.name} (Copy)`,
      processDescription: `${originalProcess.processDescription} (Copy)`,
    }
    const updatedProcesses = [...processes, duplicatedProcess]
    setProcesses(updatedProcesses)
    setActiveProcessId(duplicatedProcess.id)
    debouncedSave(updatedProcesses)
  }, [processes, debouncedSave])

  const handleDeleteProcess = useCallback((processId: string) => {
    if (processes.length <= 1) return

    const updatedProcesses = processes.filter(p => p.id !== processId)
    setProcesses(updatedProcesses)

    if (activeProcessId === processId) {
      setActiveProcessId(updatedProcesses[0]?.id || null)
    }
    debouncedSave(updatedProcesses)
  }, [processes, activeProcessId, debouncedSave])

  const handleSelectProcess = useCallback((processId: string) => {
    setActiveProcessId(processId)
    setCurrentView('single') // Switch to single view when selecting a process
  }, [])

  const handleViewChange = useCallback((view: 'single' | 'comparison') => {
    setCurrentView(view)
  }, [])

  useEffect(() => {
    setIsClient(true)

    const urlData = parseShareUrl(searchParams)
    if (urlData && Object.keys(urlData).length > 0) {
      try {
        const newProcess: Process = {
          ...DEFAULT_VALUES,
          ...urlData,
          id: generateProcessId(),
          name: 'Shared Process',
        }
        setProcesses([newProcess])
        setActiveProcessId(newProcess.id)
        toast({
          title: 'Shared data loaded',
          description: 'The shared ROI calculation has been loaded successfully.',
        })
      } catch {
        toast({
          title: 'Error loading shared data',
          description: 'Using default values instead.',
          variant: 'destructive',
        })
      }
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsedData = JSON.parse(saved)
          if (parsedData.processes && Array.isArray(parsedData.processes)) {
            setProcesses(parsedData.processes)
            setActiveProcessId(parsedData.activeProcessId || parsedData.processes[0]?.id)
          } else {
            // Migration from single process format
            const singleProcess: Process = {
              ...DEFAULT_VALUES,
              ...parsedData,
              id: generateProcessId(),
              name: 'Process 1',
            }
            setProcesses([singleProcess])
            setActiveProcessId(singleProcess.id)
          }
        } else {
          // Initialize with default process
          const defaultProcess: Process = {
            ...DEFAULT_VALUES,
            id: generateProcessId(),
            name: 'Process 1',
          }
          setProcesses([defaultProcess])
          setActiveProcessId(defaultProcess.id)
        }
      } catch {
        const defaultProcess: Process = {
          ...DEFAULT_VALUES,
          id: generateProcessId(),
          name: 'Process 1',
        }
        setProcesses([defaultProcess])
        setActiveProcessId(defaultProcess.id)
        toast({
          title: 'Error loading saved data',
          description: 'Using default values instead.',
          variant: 'destructive',
        })
      }
    }
  }, [searchParams, toast])

  const results = calculateAll(formData)

  const handleExportPDF = () => {
    try {
      exportToPDF(formData, results)
      toast({
        title: 'PDF exported successfully',
        description: 'Your ROI analysis report has been downloaded.',
      })
    } catch {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting to PDF.',
        variant: 'destructive',
      })
    }
  }

  const handleExportCSV = () => {
    try {
      exportToCSV(formData, results)
      toast({
        title: 'CSV exported successfully',
        description: 'Your data has been downloaded as a CSV file.',
      })
    } catch {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting to CSV.',
        variant: 'destructive',
      })
    }
  }

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = generateShareUrl(formData)
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied to clipboard',
        description: 'Share this link to reproduce the current analysis.',
      })
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy link to clipboard.',
        variant: 'destructive',
      })
    }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <ProcessManager
              processes={processes}
              activeProcessId={activeProcessId}
              onProcessSelect={handleSelectProcess}
              onProcessAdd={handleAddProcess}
              onProcessDuplicate={handleDuplicateProcess}
              onProcessDelete={handleDeleteProcess}
            />
            {activeProcess && (
              <FormCard data={formData} onChange={handleFormChange} />
            )}
          </div>

          {/* Report Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* View Toggle */}
            <ViewToggle
              view={currentView}
              onViewChange={handleViewChange}
              processCount={processes.length}
              hasActiveProcess={!!activeProcess}
            />

            {/* Title Block */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {currentView === 'single' && activeProcess
                    ? (formData.processDescription || `Process Analysis`)
                    : currentView === 'comparison' && processes.length > 1
                    ? `Process Comparison (${processes.length} processes)`
                    : 'ROI Analysis Dashboard'}
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-col gap-1">
                    {currentView === 'single' && activeProcess && (
                      <span><strong>Department:</strong> {formData.department} | <strong>Industry:</strong> {formData.industry}</span>
                    )}
                    <span><strong>Generated:</strong> {format(new Date(), 'PPP')}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleExportPDF} size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={handleCopyShareLink} variant="outline" size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Copy Share Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Content Based on View */}
            {currentView === 'single' && activeProcess && (
              <>
                {/* Single Process Analysis */}
                <KpiStrip results={results} currency={formData.currency} />
                <SimpleRecommendationsCard data={formData} results={results} />
              </>
            )}

            {currentView === 'comparison' && processes.length >= 2 && (
              <>
                {/* Process Comparison */}
                <ProcessComparison processes={processes} />
              </>
            )}

            {/* Fallback when no appropriate view is available */}
            {((currentView === 'single' && !activeProcess) ||
              (currentView === 'comparison' && processes.length < 2)) && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {currentView === 'single' && !activeProcess && 'Select a process to view detailed analysis'}
                    {currentView === 'comparison' && processes.length < 2 && 'Add at least 2 processes to compare them'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <HomeContent />
    </Suspense>
  )
}