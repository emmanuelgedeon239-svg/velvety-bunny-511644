import { createFileRoute, redirect } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { getServerUser } from '../../lib/auth'
import { getAllResponses } from '../../server/admin.functions'
import { useIdentity } from '../../lib/identity-context'
import {
  average,
  computeConclusions,
  countBy,
  countMultiBy,
  percentage,
  stressDistribution,
  topEntry,
  type SurveyRow,
} from '../../lib/insights'
import { downloadCsv } from '../../lib/csv'
import { ChartCard, SimpleBarChart, SimplePieChart, StressLevelBarChart } from '../../components/admin/Charts'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user || !user.roles?.includes('admin')) {
      throw redirect({ to: '/admin/login' })
    }
  },
  loader: async () => {
    const rows = await getAllResponses()
    return { rows: rows as unknown as SurveyRow[] }
  },
  component: AdminDashboard,
})

function AdminDashboard() {
  const { rows } = Route.useLoaderData()
  const { logout } = useIdentity()

  const [country, setCountry] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [search, setSearch] = useState('')

  const countries = useMemo(() => Array.from(new Set(rows.map((r) => r.country))).sort(), [rows])
  const educationLevels = useMemo(() => Array.from(new Set(rows.map((r) => r.educationLevel))).sort(), [rows])
  const ageRanges = useMemo(() => Array.from(new Set(rows.map((r) => r.ageRange))).sort(), [rows])

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!country || r.country === country) &&
          (!educationLevel || r.educationLevel === educationLevel) &&
          (!ageRange || r.ageRange === ageRange),
      ),
    [rows, country, educationLevel, ageRange],
  )

  const conclusions = useMemo(() => computeConclusions(filtered), [filtered])

  const stressFreqData = useMemo(() => countBy(filtered, (r) => r.stressFrequency), [filtered])
  const stressSourcesData = useMemo(() => countMultiBy(filtered, (r) => r.stressSources), [filtered])
  const copingMethodsData = useMemo(() => countMultiBy(filtered, (r) => r.copingMethods), [filtered])
  const interestData = useMemo(() => countBy(filtered, (r) => r.futureSolutionInterest), [filtered])
  const stressLevelData = useMemo(() => stressDistribution(filtered), [filtered])

  const avgStress = average(filtered.map((r) => r.stressLevel))
  const interestedPct = percentage(
    filtered.filter((r) => r.futureSolutionInterest === 'Oui').length,
    filtered.length,
  )
  const mainSource = topEntry(countBy(filtered, (r) => r.mainStressSource))

  const voices = useMemo(() => {
    const q = search.trim().toLowerCase()
    return filtered
      .flatMap((r) =>
        [
          { field: 'Ce qui les stresse', text: r.stressDescription },
          { field: 'Ce qui leur manque', text: r.missingSupport },
          { field: "Ce qu'ils attendent", text: r.regularUsageMotivation },
        ]
          .filter((v) => v.text && v.text.trim().length > 0)
          .map((v) => ({ id: `${r.id}-${v.field}`, ...v })),
      )
      .filter((v) => !q || v.text!.toLowerCase().includes(q))
  }, [filtered, search])

  function resetFilters() {
    setCountry('')
    setEducationLevel('')
    setAgeRange('')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-950">Smart Study — Insights</h1>
            <p className="mt-1 text-sm text-slate-500">Comprendre les étudiants pour décider quoi construire ensuite.</p>
          </div>
          <button
            onClick={() => logout().then(() => (window.location.href = '/admin/login'))}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Se déconnecter
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
            Pas encore de données. Les statistiques apparaîtront dès les premières participations.
          </p>
        ) : (
          <>
            {/* Filtres */}
            <div className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <FilterSelect label="Pays" value={country} onChange={setCountry} options={countries} />
              <FilterSelect label="Niveau d'études" value={educationLevel} onChange={setEducationLevel} options={educationLevels} />
              <FilterSelect label="Tranche d'âge" value={ageRange} onChange={setAgeRange} options={ageRanges} />
              <button onClick={resetFilters} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                Réinitialiser
              </button>
              <button
                onClick={() => downloadCsv(filtered)}
                className="ml-auto rounded-full bg-blue-800 px-4 py-2 text-sm font-semibold text-white"
              >
                📥 Exporter les réponses
              </button>
            </div>

            {/* KPI */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Kpi label="Réponses" value={String(filtered.length)} />
              <Kpi label="Stress moyen /10" value={avgStress !== null ? avgStress.toFixed(1) : '—'} />
              <Kpi label="Intéressés par une solution" value={interestedPct !== null ? `${interestedPct}%` : '—'} />
              <Kpi label="Principale source de stress" value={mainSource ?? '—'} small />
            </div>

            {/* Graphiques */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ChartCard title="Distribution du stress (1 à 10)">
                <StressLevelBarChart data={stressLevelData} />
              </ChartCard>
              <ChartCard title="Fréquence du stress">
                <SimplePieChart data={stressFreqData} />
              </ChartCard>
              <ChartCard title="Principales sources du stress">
                <SimpleBarChart data={stressSourcesData} />
              </ChartCard>
              <ChartCard title="Méthodes de gestion du stress">
                <SimpleBarChart data={copingMethodsData} />
              </ChartCard>
              <ChartCard title="Intérêt pour une future solution">
                <SimplePieChart data={interestData} />
              </ChartCard>
            </div>

            {/* Voix des étudiants */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-blue-950">💬 Voix des étudiants</h2>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans les réponses…"
                className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {voices.length === 0 ? (
                  <p className="text-sm text-slate-400">Aucune réponse ne correspond.</p>
                ) : (
                  voices.slice(0, 30).map((v) => (
                    <div key={v.id} className="rounded-xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-700">{v.field}</p>
                      <p className="text-slate-700">{v.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Conclusions */}
            <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-bold text-blue-950">🧠 Ce que les données nous disent</h2>

              {!conclusions.hasEnoughData ? (
                <p className="mt-4 text-sm text-slate-500">Données insuffisantes pour tirer une conclusion fiable.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>Les réponses recueillies suggèrent que la principale source de stress est « {conclusions.mainStressSource} ».</li>
                  <li>
                    Le niveau moyen de stress déclaré est de {conclusions.averageStressLevel?.toFixed(1)}/10, et{' '}
                    {conclusions.highStressPercentage}% des répondants indiquent un niveau élevé (≥ 7/10).
                  </li>
                  <li>La fréquence de stress la plus rapportée est « {conclusions.dominantStressFrequency} ».</li>
                  <li>
                    La méthode de gestion la plus utilisée est « {conclusions.topCopingMethod} », mais{' '}
                    {conclusions.ineffectiveCopingPercentage}% des répondants estiment que leurs méthodes actuelles ne les aident pas
                    vraiment ou pas du tout.
                  </li>
                  <li>
                    Le signal observé indique que {conclusions.futureInterestPercentage}% des répondants seraient intéressés pour
                    tester une future solution, avec une préférence marquée pour « {conclusions.topDesiredFeature} ».
                  </li>
                </ul>
              )}

              <h3 className="mt-6 text-base font-bold text-blue-950">🚀 Ce que Smart Study devrait envisager</h3>
              {!conclusions.hasEnoughData ? (
                <p className="mt-2 text-sm text-slate-500">Données insuffisantes pour tirer une conclusion fiable.</p>
              ) : (
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-blue-900">PROBLÈME PRIORITAIRE — </span>
                    {conclusions.mainStressSource}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-900">BESOIN IDENTIFIÉ — </span>
                    {conclusions.topDesiredFeature}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-900">SIGNAL DE DEMANDE — </span>
                    {conclusions.futureInterestPercentage}% des répondants se disent intéressés pour tester une future solution.
                  </p>
                  <p>
                    <span className="font-semibold text-blue-900">PROCHAINE EXPÉRIMENTATION — </span>
                    Une expérimentation pourrait consister à tester un premier prototype simple centré sur « {conclusions.topDesiredFeature} »
                    auprès d'un petit groupe d'étudiants intéressés, avant d'investir dans une solution plus complète.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Kpi({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 font-bold text-blue-950 ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="flex flex-col text-xs font-medium text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
      >
        <option value="">Tous</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
