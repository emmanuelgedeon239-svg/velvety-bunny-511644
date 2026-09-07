import { createMiddleware } from '@tanstack/react-start'
import { getUser } from '@netlify/identity'

/** Exige un utilisateur authentifié avec le rôle admin (assigné manuellement dans Netlify Identity). */
export const requireAdminMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getUser()
  if (!user) throw new Error('Authentification requise')
  if (!user.roles?.includes('admin')) throw new Error("Rôle 'admin' requis")
  return next({ context: { user } })
})
