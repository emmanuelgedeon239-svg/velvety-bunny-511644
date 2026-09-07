import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { emptyDraft, SURVEY_STORAGE_KEY, type SurveyDraft } from '../lib/survey-state'
import { submitSurvey } from '../server/survey.functions'
import { StepCoping, StepFuture, StepProfile, StepSources, StepStress } from '../components/survey/Steps'

export const Route = createFileRoute('/enquete')({
  component: Enquete,
})

const TOTAL_STEPS = 5

function loadDraft(): SurveyDraft {
  if (typeof window === 'undefined') return emptyDraft
  try {
    const raw = window.localStorage.getItem(SURVEY_STORAGE_KEY)
    if (!raw) return emptyDraft
    return { ...emptyDraft, ...JSON.parse(raw) }
  } catch {
    return emptyDraft
  }
}

function validateStep(step: number, draft: SurveyDraft): boolean {
  if (step === 1) {
    if (!draft.ageRange || !draft.educationLevel) return false
    if (!draft.country) return false
    if (draft.country === 'Autre' && !draft.countryOther.trim()) return false
    return true
  }
  if (step === 2) return !!draft.stressFrequency && draft.stressLevel !== null
  if (step === 3) return draft.stressSources.length > 0 && !!draft.mainStressSource
  if (step === 4) return draft.copingMethods.length > 0 && !!draft.copingEffectiveness
  if (step === 5) return draft.desiredFeatures.length > 0 && !!draft.futureSolutionInterest
  return true
}

function Enquete() {
  const navigate = useNavigate()
  const submit = useServerFn(submitSurvey)

  const [step, setStep] = useState(0) // 0 = écran de consentement
  const [draft, setDraft] = useState<SurveyDraft>(emptyDraft)
  const [hydrated, setHydrated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(loadDraft())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify(draft))
  }, [draft, hydrated])

  function set<K extends keyof SurveyDraft>(key: K, value: SurveyDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      await submit({
        data: {
          ageRange: draft.ageRange as any,
          country: draft.country === 'Autre' ? draft.countryOther.trim() : draft.country,
          educationLevel: draft.educationLevel as any,
          fieldOfStudy: draft.fieldOfStudy.trim() || undefined,
          stressFrequency: draft.stressFrequency as any,
          stressLevel: draft.stressLevel as number,
          stressSources: draft.stressSources as any,
          mainStressSource: draft.mainStressSource as any,
          stressDescription: draft.stressDescription.trim() || undefined,
          copingMethods: draft.copingMethods as any,
          copingEffectiveness: draft.copingEffectiveness as any,
          missingSupport: draft.missingSupport.trim() || undefined,
          desiredFeatures: draft.desiredFeatures as any,
          regularUsageMotivation: draft.regularUsageMotivation.trim() || undefined,
          futureSolutionInterest: draft.futureSolutionInterest as any,
        },
      })
      window.localStorage.removeItem(SURVEY_STORAGE_KEY)
      navigate({ to: '/merci' })
    } catch {
      setError('Impossible d’enregistrer tes réponses. Vérifie ta connexion puis réessaie.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!hydrated) return null

  if (step === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-blue-950">Avant de commencer</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Cette enquête vise à mieux comprendre l'expérience des étudiants face au stress lié aux études. Il ne
            s'agit pas d'un test médical ou d'un diagnostic.
          </p>

          <div className="mt-6 space-y-4">
            <InfoRow icon="🔒" title="Confidentialité" text="Nous ne te demandons pas ton nom, ton numéro ou ton adresse e-mail." />
            <InfoRow icon="⏱" title="Rapidité" text="L'enquête prend environ 3 à 5 minutes." />
            <InfoRow icon="💙" title="Utilité" text="Tes réponses nous aideront à concevoir des solutions plus adaptées aux étudiants." />
          </div>

          <label className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.consent}
              onChange={(e) => set('consent', e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700"
            />
            J'accepte de participer volontairement à cette enquête.
          </label>

          <button
            type="button"
            disabled={!draft.consent}
            onClick={() => setStep(1)}
            className="mt-6 w-full rounded-full bg-blue-800 px-6 py-4 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Continuer
          </button>
        </div>
      </div>
    )
  }

  const canContinue = validateStep(step, draft)

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold text-blue-800">
          Étape {step} sur {TOTAL_STEPS}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-700 transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          {step === 1 ? <StepProfile draft={draft} set={set} /> : null}
          {step === 2 ? <StepStress draft={draft} set={set} /> : null}
          {step === 3 ? <StepSources draft={draft} set={set} /> : null}
          {step === 4 ? <StepCoping draft={draft} set={set} /> : null}
          {step === 5 ? <StepFuture draft={draft} set={set} /> : null}

          {error ? <p className="mt-6 text-sm font-medium text-red-600">{error}</p> : null}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="flex-1 rounded-full border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 active:bg-slate-50"
            >
              Retour
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 rounded-full bg-blue-800 px-6 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Continuer
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinue || submitting}
                onClick={handleSubmit}
                className="flex-1 rounded-full bg-blue-800 px-6 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? 'Envoi en cours…' : 'Envoyer mes réponses'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-blue-950">{title}</p>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </div>
  )
}
