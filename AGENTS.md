# AGENTS.md

## Vue d'ensemble

Application TanStack Start (React, SSR) qui sert un site de recherche pour Smart Study : collecte des réponses
à une enquête sur le stress étudiant, puis un tableau de bord d'analyse réservé aux administrateurs.

## Architecture

- `src/routes/` — routage par fichiers (TanStack Router). `index.tsx` = accueil, `enquete.tsx` = formulaire,
  `merci.tsx` / `suite.tsx` = pages post-enquête, `admin/login.tsx` et `admin/index.tsx` = zone admin protégée.
- `src/server/` — fonctions serveur (`createServerFn`) : `survey.functions.ts` pour l'enregistrement des réponses
  (public), `admin.functions.ts` pour la lecture des réponses (protégée par `requireAdminMiddleware`).
- `src/middleware/identity.ts` — middleware TanStack Start qui vérifie la session Netlify Identity et le rôle `admin`.
- `src/lib/identity-context.tsx` + `src/components/CallbackHandler.tsx` — pont client entre `@netlify/identity`
  et l'app (état d'auth, gestion des redirections OAuth/confirmation).
- `src/lib/insights.ts` — tous les calculs statistiques du tableau de bord (KPI, distributions, conclusions).
  Aucune donnée n'est inventée : si `rows` est vide ou trop petit, les fonctions renvoient `null`/un message
  d'insuffisance plutôt qu'une valeur fictive.
- `src/lib/survey-options.ts` — liste unique des choix de chaque question, partagée entre le formulaire client
  et la validation serveur (schéma Zod dans `survey.functions.ts`).
- `db/schema.ts` — unique table `survey_responses`. Les champs à choix multiples sont stockés en `jsonb`.
- `netlify/database/migrations/` — migrations générées par `drizzle-kit generate`. Ne jamais modifier une
  migration déjà appliquée ; en générer une nouvelle pour tout changement de schéma.

## Conventions

- Pas de données personnelles collectées ni stockées (aucun nom, téléphone, e-mail).
- Le brouillon de l'enquête est conservé dans `localStorage` (`src/lib/survey-state.ts`) jusqu'à l'envoi réussi,
  pour éviter la perte de données lors d'un rafraîchissement.
- L'authentification admin utilise `@netlify/identity` (jamais `netlify-identity-widget` ni `gotrue-js`).
  Le premier compte admin doit être créé manuellement dans le tableau de bord Netlify (Identity > inviter,
  puis ajouter le rôle `admin`).
- Netlify Identity ne fonctionne pas en local (`netlify dev` ne fait que proxy, pas de backend GoTrue réel) :
  la connexion admin doit être testée sur un déploiement Netlify (preview ou production).
- Le tableau de bord n'affiche jamais de statistiques inventées : toute section sans données réelles affiche
  un message explicite plutôt qu'un placeholder chiffré.
- Liens de communauté (`/suite`) centralisés dans `src/lib/config.ts` pour rester facilement modifiables.
