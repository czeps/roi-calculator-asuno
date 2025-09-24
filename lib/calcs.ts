import { WORKING_HOURS_PER_WEEK, WEEKS_PER_YEAR, WORKING_WEEKS_PER_YEAR } from './constants'
import type { RoiCalculatorFormData } from './schemas'

export interface CalculationResults {
  baseline: {
    hourlyRate: number
    totalHoursWeek: number
    weeklyCost: number
    annualCost: number
  }
  scenarios: {
    pess: ScenarioResults
    real: ScenarioResults
    opt: ScenarioResults
  }
}

export interface ScenarioResults {
  timeSavedHoursWeek: number
  laborSavingsWeek: number
  qualitySavingsWeek: number
  totalSavingsWeek: number
  timeSavedAnnual: number
  laborSavingsAnnual: number
  qualitySavingsAnnual: number
  totalSavingsAnnual: number
  implAnnual: number
  implAnnualYr2Plus: number
  netSavingsAnnual: number
  roi: number
  paybackMonths: number
  fteFreed: number
  npv1y: number
  npv3y: number
}

export function calculateHourlyRate(
  avgSalary: number,
  salaryPeriod: 'monthly' | 'yearly'
): number {
  const annualSalary = salaryPeriod === 'monthly' ? avgSalary * 12 : avgSalary
  return annualSalary / (WEEKS_PER_YEAR * WORKING_HOURS_PER_WEEK)
}

export function calculateBaseline(data: RoiCalculatorFormData) {
  const hourlyRate = calculateHourlyRate(data.avgSalary, data.salaryPeriod)
  const totalHoursWeek = data.hoursPerWeekPerPerson * data.people
  const weeklyCost = totalHoursWeek * hourlyRate
  const annualCost = weeklyCost * WEEKS_PER_YEAR

  return {
    hourlyRate,
    totalHoursWeek,
    weeklyCost,
    annualCost,
  }
}

export function calculateScenario(
  data: RoiCalculatorFormData,
  baseline: ReturnType<typeof calculateBaseline>,
  scenario: 'pess' | 'real' | 'opt'
): ScenarioResults {
  const { hourlyRate, totalHoursWeek, weeklyCost } = baseline

  const timeSavedHoursWeek = (totalHoursWeek * data.automationPct[scenario]) / 100
  const laborSavingsWeek = timeSavedHoursWeek * hourlyRate

  const reworkSavingsWeek =
    ((data.reworkHoursPerWeek || 0) * data.people * hourlyRate * data.qualityUpliftPct[scenario]) / 100

  const errorSavingsWeek =
    (weeklyCost * ((data.errorRatePct || 0) / 100) * data.qualityUpliftPct[scenario]) / 100

  const qualitySavingsWeek = reworkSavingsWeek + errorSavingsWeek
  const totalSavingsWeek = laborSavingsWeek + qualitySavingsWeek

  const timeSavedAnnual = timeSavedHoursWeek * WEEKS_PER_YEAR
  const laborSavingsAnnual = laborSavingsWeek * WEEKS_PER_YEAR
  const qualitySavingsAnnual = qualitySavingsWeek * WEEKS_PER_YEAR
  const totalSavingsAnnual = totalSavingsWeek * WEEKS_PER_YEAR

  const implAnnual = data.runMonthly * 12 + data.implOneOff
  const implAnnualYr2Plus = data.runMonthly * 12

  const netSavingsAnnual = totalSavingsAnnual - implAnnual
  const roi = netSavingsAnnual / implAnnual

  const monthlySavings = totalSavingsAnnual / 12
  const paybackMonths = data.implOneOff / Math.max(monthlySavings - data.runMonthly, 1e-9)

  const fteFreed = (timeSavedHoursWeek * WEEKS_PER_YEAR) / (WORKING_HOURS_PER_WEEK * WORKING_WEEKS_PER_YEAR)

  const discountRate = data.discountRatePct / 100
  const cf1 = totalSavingsAnnual - implAnnual
  const cf2 = totalSavingsAnnual - implAnnualYr2Plus
  const cf3 = totalSavingsAnnual - implAnnualYr2Plus

  const npv1y = cf1 / (1 + discountRate)
  const npv3y = cf1 / (1 + discountRate) + cf2 / Math.pow(1 + discountRate, 2) + cf3 / Math.pow(1 + discountRate, 3)

  return {
    timeSavedHoursWeek,
    laborSavingsWeek,
    qualitySavingsWeek,
    totalSavingsWeek,
    timeSavedAnnual,
    laborSavingsAnnual,
    qualitySavingsAnnual,
    totalSavingsAnnual,
    implAnnual,
    implAnnualYr2Plus,
    netSavingsAnnual,
    roi,
    paybackMonths,
    fteFreed,
    npv1y,
    npv3y,
  }
}

export function calculateAll(data: RoiCalculatorFormData): CalculationResults {
  const baseline = calculateBaseline(data)

  const scenarios = {
    pess: calculateScenario(data, baseline, 'pess'),
    real: calculateScenario(data, baseline, 'real'),
    opt: calculateScenario(data, baseline, 'opt'),
  }

  return {
    baseline,
    scenarios,
  }
}