export const DEPARTMENTS = [
  'HR',
  'Finance',
  'Operations',
  'Sales',
  'Marketing',
  'IT',
  'Customer Support',
  'Legal',
  'Procurement',
] as const

export const CATEGORIES = [
  { value: 'repetitive', label: 'Repetitive Tasks' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'data-entry', label: 'Data Entry' },
  { value: 'approvals', label: 'Approvals' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'communication', label: 'Communication' },
] as const

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Education',
  'Government',
  'Non-profit',
  'Other',
] as const

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
] as const

export const CONFIDENCE_LEVELS = ['low', 'med', 'high'] as const

export const DEFAULT_VALUES = {
  hoursPerWeekPerPerson: 10,
  people: 3,
  avgSalary: 4000,
  salaryPeriod: 'monthly' as const,
  industry: 'Technology',
  department: 'Operations',
  category: ['data-entry', 'reporting'],
  processDescription: 'Weekly reporting and data consolidation across spreadsheets.',
  errorRatePct: 0,
  reworkHoursPerWeek: 0,
  automationPct: { pess: 40, real: 40, opt: 40 },
  qualityUpliftPct: { pess: 0, real: 0, opt: 0 },
  implOneOff: 10000,
  runMonthly: 500,
  discountRatePct: 10,
  confidence: { hours: 'med' as const, salary: 'med' as const, automation: 'med' as const },
  currency: 'USD' as const,
}

export const WORKING_HOURS_PER_WEEK = 40
export const WEEKS_PER_YEAR = 52
export const VACATION_WEEKS = 4
export const WORKING_WEEKS_PER_YEAR = WEEKS_PER_YEAR - VACATION_WEEKS