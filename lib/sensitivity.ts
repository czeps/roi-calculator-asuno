import type { RoiCalculatorFormData } from './schemas'
import { calculateAll } from './calcs'

export interface SensitivityData {
  name: string
  negative: number
  positive: number
}

export function calculateSensitivityAnalysis(
  baseData: RoiCalculatorFormData
): SensitivityData[] {
  const baseResults = calculateAll(baseData)
  const baseROI = baseResults.scenarios.real.roi

  const variations = [
    {
      name: 'Hours per Person',
      getVariation: (factor: number) => ({
        ...baseData,
        hoursPerWeekPerPerson: baseData.hoursPerWeekPerPerson * factor,
      }),
    },
    {
      name: 'Number of People',
      getVariation: (factor: number) => ({
        ...baseData,
        people: Math.max(1, Math.round(baseData.people * factor)),
      }),
    },
    {
      name: 'Average Salary',
      getVariation: (factor: number) => ({
        ...baseData,
        avgSalary: baseData.avgSalary * factor,
      }),
    },
    {
      name: 'Automation %',
      getVariation: (factor: number) => ({
        ...baseData,
        automationPct: {
          pess: Math.min(100, baseData.automationPct.pess * factor),
          real: Math.min(100, baseData.automationPct.real * factor),
          opt: Math.min(100, baseData.automationPct.opt * factor),
        },
      }),
    },
  ]

  return variations.map(({ name, getVariation }) => {
    const lowVariation = getVariation(0.9)
    const highVariation = getVariation(1.1)

    const lowResults = calculateAll(lowVariation)
    const highResults = calculateAll(highVariation)

    const lowROI = lowResults.scenarios.real.roi
    const highROI = highResults.scenarios.real.roi

    return {
      name,
      negative: lowROI - baseROI,
      positive: highROI - baseROI,
    }
  })
}