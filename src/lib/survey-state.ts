export interface SurveyDraft {
  consent: boolean

  ageRange: string
  country: string
  countryOther: string
  educationLevel: string
  fieldOfStudy: string

  stressFrequency: string
  stressLevel: number | null

  stressSources: string[]
  mainStressSource: string
  stressDescription: string

  copingMethods: string[]
  copingEffectiveness: string
  missingSupport: string

  desiredFeatures: string[]
  regularUsageMotivation: string
  futureSolutionInterest: string
}

export const emptyDraft: SurveyDraft = {
  consent: false,
  ageRange: '',
  country: '',
  countryOther: '',
  educationLevel: '',
  fieldOfStudy: '',
  stressFrequency: '',
  stressLevel: null,
  stressSources: [],
  mainStressSource: '',
  stressDescription: '',
  copingMethods: [],
  copingEffectiveness: '',
  missingSupport: '',
  desiredFeatures: [],
  regularUsageMotivation: '',
  futureSolutionInterest: '',
}

export const SURVEY_STORAGE_KEY = 'smart-study-survey-draft'
