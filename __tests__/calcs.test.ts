import {
  calculateHourlyRate,
  calculateBaseline,
  calculateScenario,
  calculateAll,
} from '../lib/calcs'
import { DEFAULT_VALUES } from '../lib/constants'

describe('Calculation Functions', () => {
  const testData = {
    ...DEFAULT_VALUES,
    hoursPerWeekPerPerson: 10,
    people: 3,
    avgSalary: 4000,
    salaryPeriod: 'monthly' as const,
    errorRatePct: 8,
    reworkHoursPerWeek: 5,
    automationPct: { pess: 20, real: 40, opt: 70 },
    qualityUpliftPct: { pess: 5, real: 15, opt: 25 },
    implOneOff: 8000,
    runMonthly: 600,
    discountRatePct: 10,
  }

  describe('calculateHourlyRate', () => {
    it('should calculate hourly rate for monthly salary', () => {
      const rate = calculateHourlyRate(4000, 'monthly')
      expect(rate).toBeCloseTo(23.08, 2)
    })

    it('should calculate hourly rate for yearly salary', () => {
      const rate = calculateHourlyRate(48000, 'yearly')
      expect(rate).toBeCloseTo(23.08, 2)
    })
  })

  describe('calculateBaseline', () => {
    it('should calculate baseline costs correctly', () => {
      const baseline = calculateBaseline(testData)

      expect(baseline.hourlyRate).toBeCloseTo(23.08, 2)
      expect(baseline.totalHoursWeek).toBe(30)
      expect(baseline.weeklyCost).toBeCloseTo(692.31, 2)
      expect(baseline.annualCost).toBeCloseTo(36000, 0)
    })
  })

  describe('calculateScenario', () => {
    it('should calculate realistic scenario correctly', () => {
      const baseline = calculateBaseline(testData)
      const scenario = calculateScenario(testData, baseline, 'real')

      expect(scenario.timeSavedHoursWeek).toBe(12)
      expect(scenario.laborSavingsWeek).toBeCloseTo(276.92, 2)
      expect(scenario.totalSavingsAnnual).toBeGreaterThan(14000)
      expect(scenario.roi).toBeGreaterThan(0.5)
    })

    it('should handle scenarios without quality inputs', () => {
      const dataWithoutQuality = {
        ...testData,
        errorRatePct: undefined,
        reworkHoursPerWeek: undefined,
      }
      const baseline = calculateBaseline(dataWithoutQuality)
      const scenario = calculateScenario(dataWithoutQuality, baseline, 'real')

      expect(scenario.qualitySavingsWeek).toBe(0)
      expect(scenario.totalSavingsWeek).toBe(scenario.laborSavingsWeek)
    })
  })

  describe('calculateAll', () => {
    it('should calculate all scenarios', () => {
      const results = calculateAll(testData)

      expect(results.baseline).toBeDefined()
      expect(results.scenarios.pess).toBeDefined()
      expect(results.scenarios.real).toBeDefined()
      expect(results.scenarios.opt).toBeDefined()

      expect(results.scenarios.pess.totalSavingsAnnual).toBeLessThan(
        results.scenarios.real.totalSavingsAnnual
      )
      expect(results.scenarios.real.totalSavingsAnnual).toBeLessThan(
        results.scenarios.opt.totalSavingsAnnual
      )
    })

    it('should calculate NPV correctly', () => {
      const results = calculateAll(testData)
      const { real } = results.scenarios

      expect(real.npv1y).toBeLessThan(real.netSavingsAnnual)
      expect(real.npv3y).toBeGreaterThan(real.npv1y)
    })

    it('should calculate FTE freed correctly', () => {
      const results = calculateAll(testData)
      const { real } = results.scenarios

      expect(real.fteFreed).toBeGreaterThan(0)
      expect(real.fteFreed).toBeLessThan(testData.people)
    })
  })
})