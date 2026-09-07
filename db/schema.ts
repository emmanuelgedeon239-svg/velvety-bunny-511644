import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const surveyResponses = pgTable('survey_responses', {
  id: serial().primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  ageRange: text('age_range').notNull(),
  country: text('country').notNull(),
  educationLevel: text('education_level').notNull(),
  fieldOfStudy: text('field_of_study'),

  stressFrequency: text('stress_frequency').notNull(),
  stressLevel: integer('stress_level').notNull(),

  stressSources: jsonb('stress_sources').notNull(),
  mainStressSource: text('main_stress_source').notNull(),
  stressDescription: text('stress_description'),

  copingMethods: jsonb('coping_methods').notNull(),
  copingEffectiveness: text('coping_effectiveness').notNull(),
  missingSupport: text('missing_support'),

  desiredFeatures: jsonb('desired_features').notNull(),
  regularUsageMotivation: text('regular_usage_motivation'),
  futureSolutionInterest: text('future_solution_interest').notNull(),
})
