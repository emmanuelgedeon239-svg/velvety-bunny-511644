import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { getServerUser } from '../../lib/auth'
import { getAllResponses } from '../../server/admin.functions'
import { useIdentity } from '../../lib/identity-context'
import { average, computeConclusions, countBy, countMultiBy, percentage, stressDistribution, topEntry, type SurveyRow } from '../../lib/insights'
import { downloadCsv } from '../../lib/csv'
import { ChartCard, SimpleBarChart, SimplePieChart, StressLevelBarChart } from '../../components/admin/Charts'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user || !user.roles?.includes('admin')) throw redirect({ to: '/admin/login' })
  },
  loader: async () => ({ rows: (await getAllResponses()) as unknown as SurveyRow[] }),
  component: AdminDashboard,
})

function AdminDashboard() {
  const { rows } = Route.useLoaderData()
  const { logout } = useIdentity()
  const [country, setCountry] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [search, setSearch] = useState('')

  const countries = useMemo(() => Array.from(new Set(rows.map(r => r.country))).sort(), [rows])
  const educationLevels = useMemo(() => Array.from(new Set(rows.map(r => r.educationLevel))).sort(), [rows])
  const ageRanges = useMemo(() => Array.from(new Set(rows.map(r => r.ageRange))).sort(), [rows])

  const filtered = useMemo(() => rows.filter(r =>
    (!country || r.country === country) &&
    (!educationLevel || r.educationLevel === educationLevel) &&
    (!ageRange || r.ageRange === ageRange)
  ), [rows, country, educationLevel, ageRange])

  const conclusions = useMemo(() => computeConclusions(filtered), [filtered])
  const stressFreqData = useMemo(() => countBy(filtered, r => r.stressFrequency), [filtered])
  const stressSourcesData = useMemo(() => countMultiBy(filtered, r => r.stressSources), [filtered])
  const copingMethodsData = useMemo(() => countMultiBy(filtered, r => r.copingMethods), [filtered])
  const interestData = useMemo(() => countBy(filtered, r => r.futureSolutionInterest), [filtered])
  const stressLevelData = useMemo(() => stressDistribution(filtered), [filtered])

  const avgStress = average(filtered.map(r => r.stressLevel))
  const interestedPct = percentage(filtered.filter(r => r.futureSolutionInterest === 'Oui').length, filtered.length)
  const highStressPct = percentage(filtered.filter(r => r.stressLevel >= 7).length, filtered.length)
  const mainSource = topEntry(countBy(filtered, r => r.mainStressSource))
  const activeFilters = Number(Boolean(country)) + Number(Boolean(educationLevel)) + Number(Boolean(ageRange))

  const voices = useMemo(() => {
    const q = search.trim().toLowerCase()
    return filtered.flatMap(r => [
      { field: 'Ce qui les stresse', text: r.stressDescription },
      { field: 'Ce qui leur manque', text: r.missingSupport },
      { field: "Ce qu'ils attendent", text: r.regularUsageMotivation },
    ].filter(v => v.text?.trim()).map(v => ({ id: `${r.id}-${v.field}`, ...v })))
      .filter(v => !q || v.text!.toLowerCase().includes(q))
  }, [filtered, search])

  const resetFilters = () => {
    setCountry('')
    setEducationLevel('')
    setAgeRange('')
    setSearch('')
  }

  const handleLogout = () => logout().then(() => { window.location.href = '/admin/login' })

  if (rows.length === 0) return <EmptyState />

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900 text-lg font-bold text-white">SS</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Administration</p>
                  <h1 className="text-xl font-bold text-slate-900">Smart Study</h1>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">Analysez les réponses et identifiez les besoins prioritaires des étudiants.</p>
            </div>
            <button onClick={handleLogout} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 sm:w-auto">Se déconnecter</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Tableau de bord</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Vue d’ensemble</h2>
            </div>
            <div className="text-sm text-slate-500">{filtered.length} réponse{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''} sur {rows.length}</div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Filtres d’analyse</h3>
                <p className="text-xs text-slate-500">Affinez les statistiques selon votre cible.</p>
              </div>
              {activeFilters > 0 && <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{activeFilters} filtre{activeFilters > 1 ? 's' : ''} actif{activeFilters > 1 ? 's' : ''}</span>}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <FilterSelect label="Pays" value={country} onChange={setCountry} options={countries} />
              <FilterSelect label="Niveau d'études" value={educationLevel} onChange={setEducationLevel} options={educationLevels} />
              <FilterSelect label="Tranche d'âge" value={ageRange} onChange={setAgeRange} options={ageRanges} />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={resetFilters} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Réinitialiser</button>
              <button onClick={() => downloadCsv(filtered)} className="rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white sm:ml-auto">Exporter les réponses</button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 font-bold text-slate-900">Indicateurs clés</h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Réponses" value={String(filtered.length)} description={`sur ${rows.length} au total`} />
            <Kpi label="Stress moyen" value={avgStress !== null ? `${avgStress.toFixed(1)}/10` : '—'} description="niveau moyen déclaré" />
            <Kpi label="Stress élevé" value={highStressPct !== null ? `${highStressPct}%` : '—'} description="niveau ≥ 7/10" />
            <Kpi label="Intérêt solution" value={interestedPct !== null ? `${interestedPct}%` : '—'} description="répondants intéressés" />
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-blue-950 p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Insight principal</p>
              <h3 className="mt-2 text-xl font-bold">{mainSource ?? 'Aucune donnée disponible'}</h3>
              <p className="mt-1 max-w-2xl text-sm text-blue-100">est actuellement la principale source de stress déclarée par les répondants correspondant aux filtres sélectionnés.</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4">
              <p className="text-xs text-blue-200">Niveau moyen</p>
              <p className="mt-1 text-3xl font-bold">{avgStress !== null ? avgStress.toFixed(1) : '—'}<span className="text-base font-medium text-blue-200">/10</span></p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Analyse des données</h3>
            <p className="text-sm text-slate-500">Visualisez rapidement les tendances principales.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Distribution du stress — 1 à 10"><StressLevelBarChart data={stressLevelData} /></ChartCard>
            <ChartCard title="Fréquence du stress"><SimplePieChart data={stressFreqData} /></ChartCard>
            <ChartCard title="Principales sources du stress"><SimpleBarChart data={stressSourcesData} /></ChartCard>
            <ChartCard title="Méthodes de gestion du stress"><SimpleBarChart data={copingMethodsData} /></ChartCard>
            <ChartCard title="Intérêt pour une future solution"><SimplePieChart data={interestData} /></ChartCard>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Voix des étudiants</h3>
            <p className="text-sm text-slate-500">Consultez directement les besoins et attentes exprimés.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher dans les réponses..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100" />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">{voices.length} réponse{voices.length > 1 ? 's' : ''} trouvée{voices.length > 1 ? 's' : ''}</p>
              {search && <button onClick={() => setSearch('')} className="text-xs font-semibold text-blue-700">Effacer</button>}
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {voices.length === 0 ? <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 lg:col-span-2">Aucune réponse ne correspond à votre recherche.</div> : voices.slice(0, 30).map(v => (
                <div key={v.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">{v.field}</p>
                  <p className="text-sm leading-6 text-slate-700">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Analyse automatique</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Ce que les données nous disent</h3>

            {!conclusions.hasEnoughData ? (
              <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Les données sont encore insuffisantes pour tirer des conclusions fiables. Il faut au minimum 5 réponses.</div>
            ) : (
              <>
                <div className="mt-5 space-y-3">
                  <InsightRow label="Source principale" value={conclusions.mainStressSource} />
                  <InsightRow label="Stress moyen" value={conclusions.averageStressLevel !== null ? `${conclusions.averageStressLevel.toFixed(1)}/10` : null} />
                  <InsightRow label="Stress élevé" value={conclusions.highStressPercentage !== null ? `${conclusions.highStressPercentage}% des répondants` : null} />
                  <InsightRow label="Fréquence dominante" value={conclusions.dominantStressFrequency} />
                  <InsightRow label="Méthode de gestion principale" value={conclusions.topCopingMethod} />
                  <InsightRow label="Besoin prioritaire" value={conclusions.topDesiredFeature} />
                  <InsightRow label="Intérêt pour une solution" value={conclusions.futureInterestPercentage !== null ? `${conclusions.futureInterestPercentage}%` : null} />
                </div>

                <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Orientation stratégique</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Le problème prioritaire identifié est <strong>{conclusions.mainStressSource ?? 'non déterminé'}</strong>. Le besoin qui ressort le plus est <strong>{conclusions.topDesiredFeature ?? 'non déterminé'}</strong>. Ces éléments peuvent servir de base pour définir les prochaines fonctionnalités ou expérimentations de Smart Study.
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Kpi({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col text-xs font-semibold text-slate-500">
      {label}
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-700 focus:bg-white focus:ring-2 focus:ring-blue-100">
        <option value="">Tous</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function InsightRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900 sm:text-right">{value ?? '—'}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">📊</div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">Aucune réponse pour le moment</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Les statistiques et analyses apparaîtront automatiquement dès que les premières participations seront enregistrées.</p>
      </div>
    </div>
  )
}                                                                                             }
