import type { SurveyDraft } from '../../lib/survey-state'
import {
  AGE_RANGES,
  COUNTRIES,
  EDUCATION_LEVELS,
  STRESS_FREQUENCIES,
  STRESS_SOURCES,
  COPING_METHODS,
  COPING_EFFECTIVENESS,
  DESIRED_FEATURES,
  FUTURE_INTEREST,
} from '../../lib/survey-options'
import { CheckboxGroup, QuestionLabel, RadioGroup, ScaleButtons, TextArea, TextInput } from './fields'

type StepProps = {
  draft: SurveyDraft
  set: <K extends keyof SurveyDraft>(key: K, value: SurveyDraft[K]) => void
}

export function StepProfile({ draft, set }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <QuestionLabel>Quel âge as-tu ?</QuestionLabel>
        <RadioGroup options={AGE_RANGES} value={draft.ageRange} onChange={(v) => set('ageRange', v)} />
      </div>

      <div>
        <QuestionLabel>Dans quel pays étudies-tu actuellement ?</QuestionLabel>
        <RadioGroup options={COUNTRIES} value={draft.country} onChange={(v) => set('country', v)} />
        {draft.country === 'Autre' ? (
          <div className="mt-3">
            <TextInput value={draft.countryOther} onChange={(v) => set('countryOther', v)} placeholder="Précise le pays" />
          </div>
        ) : null}
      </div>

      <div>
        <QuestionLabel>Quel est ton niveau d'études ?</QuestionLabel>
        <RadioGroup options={EDUCATION_LEVELS} value={draft.educationLevel} onChange={(v) => set('educationLevel', v)} />
      </div>

      <div>
        <QuestionLabel optional>Ta filière ou ton domaine d'études ?</QuestionLabel>
        <TextInput value={draft.fieldOfStudy} onChange={(v) => set('fieldOfStudy', v)} placeholder="Ex : Informatique, Droit..." />
      </div>
    </div>
  )
}

export function StepStress({ draft, set }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <QuestionLabel>
          Au cours des dernières semaines, à quelle fréquence as-tu ressenti un stress important lié à tes études ?
        </QuestionLabel>
        <RadioGroup options={STRESS_FREQUENCIES} value={draft.stressFrequency} onChange={(v) => set('stressFrequency', v)} />
      </div>

      <div>
        <QuestionLabel>Sur une échelle de 1 à 10, comment évaluerais-tu ton niveau de stress lié aux études actuellement ?</QuestionLabel>
        <ScaleButtons value={draft.stressLevel} onChange={(v) => set('stressLevel', v)} />
        <p className="mt-2 text-xs text-slate-400">Cette échelle n'est pas un diagnostic médical.</p>
      </div>
    </div>
  )
}

export function StepSources({ draft, set }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <QuestionLabel>Quelles sont les principales sources de ton stress étudiant ?</QuestionLabel>
        <CheckboxGroup options={STRESS_SOURCES} value={draft.stressSources} onChange={(v) => set('stressSources', v)} />
      </div>

      <div>
        <QuestionLabel>Parmi ces éléments, lequel est actuellement ta principale source de stress ?</QuestionLabel>
        <RadioGroup options={STRESS_SOURCES} value={draft.mainStressSource} onChange={(v) => set('mainStressSource', v)} />
      </div>

      <div>
        <QuestionLabel optional>Avec tes propres mots, qu'est-ce qui te stresse le plus dans ta vie étudiante actuellement ?</QuestionLabel>
        <TextArea value={draft.stressDescription} onChange={(v) => set('stressDescription', v)} />
      </div>
    </div>
  )
}

export function StepCoping({ draft, set }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <QuestionLabel>Lorsque tu es stressé(e), que fais-tu généralement pour essayer de te sentir mieux ?</QuestionLabel>
        <CheckboxGroup options={COPING_METHODS} value={draft.copingMethods} onChange={(v) => set('copingMethods', v)} />
      </div>

      <div>
        <QuestionLabel>Est-ce que les solutions que tu utilises actuellement t'aident réellement ?</QuestionLabel>
        <RadioGroup options={COPING_EFFECTIVENESS} value={draft.copingEffectiveness} onChange={(v) => set('copingEffectiveness', v)} />
      </div>

      <div>
        <QuestionLabel optional>Qu'est-ce qui te manque aujourd'hui pour mieux gérer ton stress ?</QuestionLabel>
        <TextArea value={draft.missingSupport} onChange={(v) => set('missingSupport', v)} />
      </div>
    </div>
  )
}

export function StepFuture({ draft, set }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <QuestionLabel>Qu'aimerais-tu qu'une future solution permette de faire ?</QuestionLabel>
        <CheckboxGroup options={DESIRED_FEATURES} value={draft.desiredFeatures} onChange={(v) => set('desiredFeatures', v)} />
      </div>

      <div>
        <QuestionLabel optional>Qu'est-ce qui te donnerait réellement envie d'utiliser régulièrement une telle solution ?</QuestionLabel>
        <TextArea value={draft.regularUsageMotivation} onChange={(v) => set('regularUsageMotivation', v)} />
      </div>

      <div>
        <QuestionLabel>
          Si Smart Study créait une solution répondant réellement aux problèmes que tu rencontres, serais-tu intéressé(e) pour la
          tester ?
        </QuestionLabel>
        <RadioGroup options={FUTURE_INTEREST} value={draft.futureSolutionInterest} onChange={(v) => set('futureSolutionInterest', v)} />
      </div>
    </div>
  )
}
