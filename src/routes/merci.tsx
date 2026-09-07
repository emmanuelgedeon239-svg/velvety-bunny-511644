import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/merci')({
  component: Merci,
})

function Merci() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-950 to-blue-800 px-6 text-center text-white">
      <div className="max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Merci d'avoir participé 💙</h1>
        <p className="mt-4 text-base leading-relaxed text-blue-100">
          Tes réponses vont nous aider à mieux comprendre les réalités vécues par les étudiants et à construire des
          solutions plus utiles.
        </p>
        <p className="mt-4 text-sm font-medium text-blue-200">
          Tu viens peut-être de contribuer à la création d'une solution qui aidera d'autres étudiants comme toi.
        </p>

        <Link
          to="/suite"
          className="mt-10 inline-block w-full rounded-full bg-white px-8 py-4 text-base font-bold text-blue-900 shadow-lg sm:w-auto"
        >
          Découvrir la suite →
        </Link>
      </div>
    </div>
  )
}
