import { createFileRoute, Link } from '@tanstack/react-router'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 px-6 pb-20 pt-16 text-white sm:pt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Smart Study</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Et si on parlait du stress étudiant ?
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Smart Study mène une enquête pour mieux comprendre ce que vivent réellement les étudiants et concevoir
              des solutions adaptées à leurs besoins.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-blue-50">
              <span className="rounded-full bg-white/10 px-4 py-2">⏱ 3–5 minutes</span>
              <span className="rounded-full bg-white/10 px-4 py-2">🔒 Sans nom</span>
              <span className="rounded-full bg-white/10 px-4 py-2">📱 100 % en ligne</span>
            </div>

            <Link
              to="/enquete"
              className="mt-10 inline-block w-full rounded-full bg-white px-8 py-4 text-base font-bold text-blue-900 shadow-lg shadow-blue-950/30 transition active:scale-[0.98] sm:w-auto"
            >
              Participer à l'enquête
            </Link>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-blue-950">Pourquoi cette enquête ?</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                Entre les examens, la pression des résultats, la charge de travail et les inquiétudes concernant
                l'avenir, la vie étudiante peut être source de stress.
              </p>
              <p>Chez Smart Study, nous voulons commencer par écouter les étudiants avant de construire des solutions.</p>
              <p className="font-medium text-blue-900">Ton expérience peut nous aider à mieux comprendre le problème.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
            <h2 className="text-xl font-bold text-blue-950">Confidentialité</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Pas de nom</li>
              <li>• Pas de numéro de téléphone</li>
              <li>• Pas d'e-mail</li>
              <li>• Participation volontaire</li>
              <li>• Enquête non médicale</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
