import type { RoiCalculatorFormData } from './schemas'
import type { CalculationResults } from './calcs'
import { formatCurrency, formatPercent, formatMonths, formatFTE } from './format'

export function generateExecutiveSummary(
  data: RoiCalculatorFormData,
  results: CalculationResults
): string[] {
  const { real } = results.scenarios
  const { currency } = data

  return [
    `Automating ${data.processDescription.toLowerCase()} could save ${formatCurrency(
      real.totalSavingsAnnual,
      currency
    )} annually.`,
    `With ${formatPercent(real.roi)} ROI and ${formatMonths(real.paybackMonths)} payback period, this represents a ${
      real.roi > 1 ? 'high-value' : real.roi > 0.5 ? 'medium-value' : 'low-value'
    } investment opportunity.`,
    `The automation would free up ${formatFTE(real.fteFreed)} equivalent capacity across ${
      data.people
    } people in ${data.department}.`,
    real.qualitySavingsAnnual > real.laborSavingsAnnual * 0.1
      ? `Significant quality improvements are expected, contributing ${formatCurrency(
          real.qualitySavingsAnnual,
          currency
        )} in additional value.`
      : `Primary value comes from labor savings of ${formatCurrency(real.laborSavingsAnnual, currency)} annually.`,
  ]
}

export function generateRecommendations(
  data: RoiCalculatorFormData,
  results: CalculationResults
): string[] {
  const { real } = results.scenarios
  const recommendations = []

  if (real.roi > 2) {
    recommendations.push('💡 Proceed immediately - exceptional ROI justifies fast-track implementation')
  } else if (real.roi > 1) {
    recommendations.push('✅ Strong business case - recommend moving forward with detailed planning')
  } else if (real.roi > 0.5) {
    recommendations.push('⚠️ Moderate returns - consider phased approach or scope optimization')
  } else {
    recommendations.push('❌ Low returns - reassess automation scope or explore alternative solutions')
  }

  if (real.paybackMonths < 6) {
    recommendations.push('🚀 Quick payback enables self-funding within first year')
  } else if (real.paybackMonths > 18) {
    recommendations.push('📅 Long payback period requires careful cash flow planning')
  }

  if (data.confidence.automation === 'low') {
    recommendations.push('🔍 Conduct pilot or proof-of-concept to validate automation assumptions')
  }

  return recommendations
}

export function generateRisksAndMitigations(): Array<{
  risk: string
  mitigation: string
  severity: 'low' | 'medium' | 'high'
}> {
  return [
    {
      risk: 'Implementation complexity exceeds estimates',
      mitigation: 'Start with MVP, iterate based on learnings',
      severity: 'medium',
    },
    {
      risk: 'User adoption and change management challenges',
      mitigation: 'Involve end users in design, provide comprehensive training',
      severity: 'high',
    },
    {
      risk: 'Technology integration issues',
      mitigation: 'Conduct technical feasibility assessment upfront',
      severity: 'medium',
    },
    {
      risk: 'Actual time savings lower than projected',
      mitigation: 'Use conservative estimates, monitor and adjust scope',
      severity: 'medium',
    },
    {
      risk: 'Ongoing maintenance costs higher than expected',
      mitigation: 'Factor 20% buffer into operational cost estimates',
      severity: 'low',
    },
  ]
}