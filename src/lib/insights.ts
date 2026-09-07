export type SurveyRow = {
  id: number
  createdAt: Date
  ageRange: string
  country: string
  educationLevel: string
  fieldOfStudy: string | null
  stressFrequency: string
  stressLevel: number
  stressSources: string[]
  mainStressSource: string
  stressDescription: string | null
  copingMethods: string[]
  copingEffectiveness: string
  missingSupport: string | null
  desiredFeatures: string[]
  regularUsageMotivation: string | null
  futureSolutionInterest: string
}

export function countBy(rows: SurveyRow[], get: (r: SurveyRow) => string): { name: string; value: number }[] {
  const counts = new Map<string, number>()
  for (const r of rows) {
    const key = get(r)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function countMultiBy(rows: SurveyRow[], get: (r: SurveyRow) => string[]): { name: string; value: number }[] {
  const counts = new Map<string, number>()
  for (const r of rows) {
    for (const key of get(r)) {
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function stressDistribution(rows: SurveyRow[]) {
  const buckets = Array.from({ length: 10 }, (_, i) => ({ name: String(i + 1), value: 0 }))
  for (const r of rows) {
    if (r.stressLevel >= 1 && r.stressLevel <= 10) buckets[r.stressLevel - 1].value += 1
  }
  return buckets
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function percentage(count: number, total: number): number | null {
  if (total === 0) return null
  return Math.round((count / total) * 100)
}

export function topEntry(entries: { name: string; value: number }[]): string | null {
  return entries[0]?.name ?? null
}

export interface Conclusions {
  hasEnoughData: boolean
  responseCount: number
  mainStressSource: string | null
  averageStressLevel: number | null
  highStressPercentage: number | null
  dominantStressFrequency: string | null
  topCopingMethod: string | null
  ineffectiveCopingPercentage: number | null
  topDesiredFeature: string | null
  futureInterestPercentage: number | null
}

const MIN_RESPONSES_FOR_CONCLUSIONS = 5

export function computeConclusions(rows: SurveyRow[]): Conclusions {
  const responseCount = rows.length
  const hasEnoughData = responseCount >= MIN_RESPONSES_FOR_CONCLUSIONS

  const mainSources = countBy(rows, (r) => r.mainStressSource)
  const frequencies = countBy(rows, (r) => r.stressFrequency)
  const copingMethods = countMultiBy(rows, (r) => r.copingMethods)
  const desiredFeatures = countMultiBy(rows, (r) => r.desiredFeatures)

  const highStressCount = rows.filter((r) => r.stressLevel >= 7).length
  const ineffectiveCount = rows.filter((r) => r.copingEffectiveness === 'Pas vraiment' || r.copingEffectiveness === 'Pas du tout').length
  const interestedCount = rows.filter((r) => r.futureSolutionInterest === 'Oui').length

  return {
    hasEnoughData,
    responseCount,
    mainStressSource: topEntry(mainSources),
    averageStressLevel: average(rows.map((r) => r.stressLevel)),
    highStressPercentage: percentage(highStressCount, responseCount),
    dominantStressFrequency: topEntry(frequencies),
    topCopingMethod: topEntry(copingMethods),
    ineffectiveCopingPercentage: percentage(ineffectiveCount, responseCount),
    topDesiredFeature: topEntry(desiredFeatures),
    futureInterestPercentage: percentage(interestedCount, responseCount),
  }
}
