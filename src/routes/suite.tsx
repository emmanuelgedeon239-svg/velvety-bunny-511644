import { createFileRoute } from '@tanstack/react-router'
import { communityConfig } from '../lib/config'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/suite')({
  component: Suite,
})

function Suite() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
            Tu veux participer à la suite ?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Nous préparons de nouvelles initiatives pour aider les étudiants à mieux gérer leurs difficultés
            scolaires et leur bien-être.
          </p>

          <a
            href={communityConfig.communityUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block w-full rounded-full bg-blue-800 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-900/20 sm:w-auto"
          >
            Rejoindre la communauté Smart Study
          </a>

          <div className="mt-10 flex justify-center gap-4 text-sm font-medium text-blue-800">
            <a href={communityConfig.facebookUrl} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2">
              Facebook
            </a>
            <a href={communityConfig.tiktokUrl} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2">
              TikTok
            </a>
            <a href={communityConfig.instagramUrl} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2">
              Instagram
            </a>
            <a href={communityConfig.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-4 py-2">
              WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
