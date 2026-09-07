import type { SurveyRow } from './insights'

const CSV_COLUMNS: { key: keyof SurveyRow; label: string }[] = [
  { key: 'id', label: 'id' },
  { key: 'createdAt', label: 'created_at' },
  { key: 'ageRange', label: 'age_range' },
  { key: 'country', label: 'country' },
  { key: 'educationLevel', label: 'education_level' },
  { key: 'fieldOfStudy', label: 'field_of_study' },
  { key: 'stressFrequency', label: 'stress_frequency' },
  { key: 'stressLevel', label: 'stress_level' },
  { key: 'stressSources', label: 'stress_sources' },
  { key: 'mainStressSource', label: 'main_stress_source' },
  { key: 'stressDescription', label: 'stress_description' },
  { key: 'copingMethods', label: 'coping_methods' },
  { key: 'copingEffectiveness', label: 'coping_effectiveness' },
  { key: 'missingSupport', label: 'missing_support' },
  { key: 'desiredFeatures', label: 'desired_features' },
  { key: 'regularUsageMotivation', label: 'regular_usage_motivation' },
  { key: 'futureSolutionInterest', label: 'future_solution_interest' },
]

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = Array.isArray(value) ? value.join('; ') : String(value)
  return `"${str.replace(/"/g, '""')}"`
}

export function rowsToCsv(rows: SurveyRow[]): string {
  const header = CSV_COLUMNS.map((c) => c.label).join(',')
  const lines = rows.map((row) => CSV_COLUMNS.map((c) => csvCell(row[c.key])).join(','))
  return [header, ...lines].join('\n')
}

export function downloadCsv(rows: SurveyRow[]) {
  const csv = rowsToCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `smart-study-reponses-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
