import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { formatCurrency, formatPercent, formatMonths, formatFTE } from './format'
import { generateExecutiveSummary, generateRecommendations } from './report'
import type { RoiCalculatorFormData } from './schemas'
import type { CalculationResults } from './calcs'

export function exportToPDF(data: RoiCalculatorFormData, results: CalculationResults) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  let yPos = margin

  const addText = (text: string, x: number, size: number = 12, style: string = 'normal') => {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.text(text, x, yPos)
    yPos += size / 2 + 2
  }

  const addNewLine = (height: number = 5) => {
    yPos += height
  }

  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPos + requiredSpace > doc.internal.pageSize.height - margin) {
      doc.addPage()
      yPos = margin
    }
  }

  doc.setTextColor(0, 0, 0)

  addText('Automation ROI Analysis Report', margin, 20, 'bold')
  addText(`Generated on ${format(new Date(), 'PPP')}`, margin, 10)
  addNewLine(10)

  addText('Executive Summary', margin, 16, 'bold')
  addNewLine(5)

  const executiveSummary = generateExecutiveSummary(data, results)
  executiveSummary.forEach(point => {
    const lines = doc.splitTextToSize(point, pageWidth - 2 * margin)
    lines.forEach((line: string) => {
      checkPageBreak()
      addText(`• ${line}`, margin + 5, 10)
    })
    addNewLine(3)
  })

  addNewLine(10)
  checkPageBreak(50)

  addText('Key Metrics', margin, 16, 'bold')
  addNewLine(5)

  const metrics = [
    ['Baseline Annual Cost', formatCurrency(results.baseline.annualCost, data.currency)],
    ['Net Savings (Realistic)', formatCurrency(results.scenarios.real.netSavingsAnnual, data.currency)],
    ['ROI', formatPercent(results.scenarios.real.roi)],
    ['Payback Period', formatMonths(results.scenarios.real.paybackMonths)],
    ['FTE Freed', formatFTE(results.scenarios.real.fteFreed)],
  ]

  metrics.forEach(([label, value]) => {
    checkPageBreak()
    addText(`${label}: ${value}`, margin, 11)
  })

  addNewLine(15)
  checkPageBreak(50)

  addText('Scenario Comparison', margin, 16, 'bold')
  addNewLine(10)

  const scenarios = [
    ['', 'Pessimistic', 'Realistic', 'Optimistic'],
    ['Total Savings (Annual)',
     formatCurrency(results.scenarios.pess.totalSavingsAnnual, data.currency),
     formatCurrency(results.scenarios.real.totalSavingsAnnual, data.currency),
     formatCurrency(results.scenarios.opt.totalSavingsAnnual, data.currency)],
    ['Net Savings (Year 1)',
     formatCurrency(results.scenarios.pess.netSavingsAnnual, data.currency),
     formatCurrency(results.scenarios.real.netSavingsAnnual, data.currency),
     formatCurrency(results.scenarios.opt.netSavingsAnnual, data.currency)],
    ['ROI',
     formatPercent(results.scenarios.pess.roi),
     formatPercent(results.scenarios.real.roi),
     formatPercent(results.scenarios.opt.roi)],
  ]

  scenarios.forEach((row, rowIndex) => {
    checkPageBreak()
    row.forEach((cell, cellIndex) => {
      const x = margin + cellIndex * ((pageWidth - 2 * margin) / 4)
      doc.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal')
      doc.text(cell, x, yPos)
    })
    yPos += 12
  })

  addNewLine(15)
  checkPageBreak(50)

  addText('Recommendations', margin, 16, 'bold')
  addNewLine(5)

  const recommendations = generateRecommendations(data, results)
  recommendations.forEach(rec => {
    const cleanRec = rec.replace(/[💡✅⚠️❌🚀📅🔍]/g, '').trim()
    const lines = doc.splitTextToSize(cleanRec, pageWidth - 2 * margin)
    lines.forEach((line: string) => {
      checkPageBreak()
      addText(`• ${line}`, margin + 5, 10)
    })
    addNewLine(3)
  })

  addNewLine(15)
  checkPageBreak(50)

  addText('Key Assumptions', margin, 16, 'bold')
  addNewLine(5)

  const assumptions = [
    `Process: ${data.processDescription}`,
    `Department: ${data.department} | Industry: ${data.industry}`,
    `People: ${data.people} | Hours per person: ${data.hoursPerWeekPerPerson}h/week`,
    `Salary: ${formatCurrency(data.avgSalary, data.currency)} ${data.salaryPeriod}`,
    `Implementation: ${formatCurrency(data.implOneOff, data.currency)} one-time + ${formatCurrency(data.runMonthly, data.currency)}/month`,
    `Automation potential: ${data.automationPct.pess}% / ${data.automationPct.real}% / ${data.automationPct.opt}%`,
  ]

  assumptions.forEach(assumption => {
    const lines = doc.splitTextToSize(assumption, pageWidth - 2 * margin)
    lines.forEach((line: string) => {
      checkPageBreak()
      addText(line, margin, 10)
    })
  })

  doc.save(`roi-analysis-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export function exportToCSV(data: RoiCalculatorFormData, results: CalculationResults) {
  const rows = [
    ['Metric', 'Pessimistic', 'Realistic', 'Optimistic'],
    ['Time Saved (hours/week)',
     results.scenarios.pess.timeSavedHoursWeek.toFixed(1),
     results.scenarios.real.timeSavedHoursWeek.toFixed(1),
     results.scenarios.opt.timeSavedHoursWeek.toFixed(1)],
    ['Labor Savings (weekly)',
     results.scenarios.pess.laborSavingsWeek.toFixed(0),
     results.scenarios.real.laborSavingsWeek.toFixed(0),
     results.scenarios.opt.laborSavingsWeek.toFixed(0)],
    ['Quality Savings (weekly)',
     results.scenarios.pess.qualitySavingsWeek.toFixed(0),
     results.scenarios.real.qualitySavingsWeek.toFixed(0),
     results.scenarios.opt.qualitySavingsWeek.toFixed(0)],
    ['Total Savings (annual)',
     results.scenarios.pess.totalSavingsAnnual.toFixed(0),
     results.scenarios.real.totalSavingsAnnual.toFixed(0),
     results.scenarios.opt.totalSavingsAnnual.toFixed(0)],
    ['Implementation Cost (Year 1)',
     results.scenarios.pess.implAnnual.toFixed(0),
     results.scenarios.real.implAnnual.toFixed(0),
     results.scenarios.opt.implAnnual.toFixed(0)],
    ['Net Savings (Year 1)',
     results.scenarios.pess.netSavingsAnnual.toFixed(0),
     results.scenarios.real.netSavingsAnnual.toFixed(0),
     results.scenarios.opt.netSavingsAnnual.toFixed(0)],
    ['ROI (Year 1)',
     (results.scenarios.pess.roi * 100).toFixed(1) + '%',
     (results.scenarios.real.roi * 100).toFixed(1) + '%',
     (results.scenarios.opt.roi * 100).toFixed(1) + '%'],
    ['Payback Period (months)',
     results.scenarios.pess.paybackMonths.toFixed(1),
     results.scenarios.real.paybackMonths.toFixed(1),
     results.scenarios.opt.paybackMonths.toFixed(1)],
    ['FTE Freed',
     results.scenarios.pess.fteFreed.toFixed(2),
     results.scenarios.real.fteFreed.toFixed(2),
     results.scenarios.opt.fteFreed.toFixed(2)],
    ['NPV (1 year)',
     results.scenarios.pess.npv1y.toFixed(0),
     results.scenarios.real.npv1y.toFixed(0),
     results.scenarios.opt.npv1y.toFixed(0)],
    ['NPV (3 years)',
     results.scenarios.pess.npv3y.toFixed(0),
     results.scenarios.real.npv3y.toFixed(0),
     results.scenarios.opt.npv3y.toFixed(0)],
  ]

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `roi-analysis-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function generateShareUrl(data: RoiCalculatorFormData): string {
  const params = new URLSearchParams()

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      params.set(key, JSON.stringify(value))
    } else {
      params.set(key, String(value))
    }
  })

  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

export function parseShareUrl(searchParams: URLSearchParams): Partial<RoiCalculatorFormData> | null {
  try {
    const data: any = {}

    searchParams.forEach((value, key) => {
      try {
        data[key] = JSON.parse(value)
      } catch {
        if (value === 'true' || value === 'false') {
          data[key] = value === 'true'
        } else if (!isNaN(Number(value))) {
          data[key] = Number(value)
        } else {
          data[key] = value
        }
      }
    })

    return Object.keys(data).length > 0 ? data : null
  } catch {
    return null
  }
}