# Smart Study — Enquête sur le stress étudiant

Site de recherche et de validation de marché pour Smart Study, une marque éducative basée au Bénin. Le site
permet de collecter les réponses des étudiants à une enquête sur le stress lié aux études, puis de les consulter
sous forme de tableau de bord réservé à l'équipe.

Smart Study ne diagnostique pas, ne traite pas et ne remplace pas un professionnel de santé. Ce site est un outil
de recherche, pas une application médicale.

## Pages

- `/` — page d'accueil et présentation de l'enquête
- `/enquete` — formulaire d'enquête en 5 étapes
- `/merci` — page de remerciement après envoi
- `/suite` — liens vers la communauté Smart Study
- `/admin/login` — connexion administrateur
- `/admin` — tableau de bord (réservé aux comptes ayant le rôle `admin`)

## Stack technique

- TanStack Start (React) + TanStack Router
- Tailwind CSS
- Netlify Database (Postgres géré) avec Drizzle ORM
- Netlify Identity pour l'authentification administrateur
- Recharts pour les graphiques du tableau de bord

## Lancer le projet en local

```bash
pnpm install
pnpm dev
```

Le site est disponible sur `http://localhost:3000`. Pour tester l'intégration Netlify (base de données, redirections),
utilisez plutôt :

```bash
netlify dev
```

Notez que Netlify Identity (connexion admin) ne fonctionne pas en local — il faut un déploiement Netlify réel
(preview ou production) pour tester la connexion administrateur.

## Créer le premier compte administrateur

1. Dans le tableau de bord Netlify du site, ouvrir **Identity**
2. Inviter l'adresse e-mail de l'administrateur
3. Une fois le compte accepté, ouvrir sa fiche et ajouter le rôle `admin`

Sans ce rôle, la connexion à `/admin/login` réussit mais l'accès à `/admin` reste refusé.
