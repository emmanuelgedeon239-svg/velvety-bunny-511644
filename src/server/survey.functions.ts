import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { surveyResponses } from '../../db/schema.js'
import {
  AGE_RANGES,
  EDUCATION_LEVELS,
  STRESS_FREQUENCIES,
  STRESS_SOURCES,
  COPING_METHODS,
  COPING_EFFECTIVENESS,
  DESIRED_FEATURES,
  FUTURE_INTEREST,
} from '../lib/survey-options.js'

const SubmitSurveySchema = z.object({
  ageRange: z.enum(AGE_RANGES),
  country: z.string().min(1),
  educationLevel: z.enum(EDUCATION_LEVELS),
  fieldOfStudy: z.string().optional(),

  stressFrequency: z.enum(STRESS_FREQUENCIES),
  stressLevel: z.number().int().min(1).max(10),

  stressSources: z.array(z.enum(STRESS_SOURCES)).min(1),
  mainStressSource: z.enum(STRESS_SOURCES),
  stressDescription: z.string().optional(),

  copingMethods: z.array(z.enum(COPING_METHODS)).min(1),
  copingEffectiveness: z.enum(COPING_EFFECTIVENESS),
  missingSupport: z.string().optional(),

  desiredFeatures: z.array(z.enum(DESIRED_FEATURES)).min(1),
  regularUsageMotivation: z.string().optional(),
  futureSolutionInterest: z.enum(FUTURE_INTEREST),
})

export type SubmitSurveyInput = z.infer<typeof SubmitSurveySchema>

export const submitSurvey = createServerFn({ method: 'POST' })
  .inputValidator(SubmitSurveySchema)
  .handler(async ({ data }) => {
    await db.insert(surveyResponses).values({
      ageRange: data.ageRange,
      country: data.country,
      educationLevel: data.educationLevel,
      fieldOfStudy: data.fieldOfStudy || null,
      stressFrequency: data.stressFrequency,
      stressLevel: data.stressLevel,
      stressSources: data.stressSources,
      mainStressSource: data.mainStressSource,
      stressDescription: data.stressDescription || null,
      copingMethods: data.copingMethods,
      copingEffectiveness: data.copingEffectiveness,
      missingSupport: data.missingSupport || null,
      desiredFeatures: data.desiredFeatures,
      regularUsageMotivation: data.regularUsageMotivation || null,
      futureSolutionInterest: data.futureSolutionInterest,
    })

    return { success: true }
  })
