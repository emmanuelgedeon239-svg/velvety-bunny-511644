import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { login, AuthError } from '@netlify/identity'
import { useIdentity } from '../../lib/identity-context'

export const Route = createFileRoute('/admin/login')({
  component: AdminLogin,
})

function AdminLogin() {
  const { ready, user } = useIdentity()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ready && user?.roles?.includes('admin')) {
      window.location.href = '/admin'
    }
  }, [ready, user])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const loggedIn = await login(email, password)
      if (!loggedIn.roles?.includes('admin')) {
        setError('Ce compte n’a pas accès au tableau de bord administrateur.')
        setLoading(false)
        return
      }
      window.location.href = '/admin'
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.status === 401 ? 'E-mail ou mot de passe incorrect.' : err.message)
      } else {
        setError('Connexion impossible. Réessaie.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-xl font-bold text-blue-950">Smart Study — Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Connecte-toi pour accéder aux résultats de l'enquête.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-blue-800 px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
