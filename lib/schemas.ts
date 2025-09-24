import { z } from 'zod'
import { DEPARTMENTS, CATEGORIES, INDUSTRIES, CONFIDENCE_LEVELS, CURRENCIES } from './constants'

const scenarioSchema = z.object({
  pess: z.number().min(0).max(100),
  real: z.number().min(0).max(100),
  opt: z.number().min(0).max(100),
})

const confidenceSchema = z.object({
  hours: z.enum(CONFIDENCE_LEVELS),
  salary: z.enum(CONFIDENCE_LEVELS),
  automation: z.enum(CONFIDENCE_LEVELS),
})

export const roiCalculatorSchema = z.object({
  hoursPerWeekPerPerson: z.number().min(0).max(60),
  people: z.number().min(1).max(10),
  avgSalary: z.number().min(0),
  salaryPeriod: z.enum(['monthly', 'yearly']),
  industry: z.string().min(1),
  department: z.enum(DEPARTMENTS),
  category: z.array(z.string()),
  processDescription: z.string().min(1).max(280),
  errorRatePct: z.number().min(0).max(30).optional(),
  reworkHoursPerWeek: z.number().min(0).max(60).optional(),
  automationPct: scenarioSchema,
  qualityUpliftPct: scenarioSchema,
  implOneOff: z.number().min(0),
  runMonthly: z.number().min(0),
  discountRatePct: z.number().min(0).max(50),
  confidence: confidenceSchema,
  currency: z.enum(CURRENCIES.map(c => c.code) as [string, ...string[]]),
})

export type RoiCalculatorFormData = z.infer<typeof roiCalculatorSchema>
export type ScenarioData = z.infer<typeof scenarioSchema>
export type ConfidenceData = z.infer<typeof confidenceSchema>