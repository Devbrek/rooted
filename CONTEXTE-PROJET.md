# CONTEXTE-PROJET.md

## Positionnement

- Projet démo à vocation portfolio, pas un vrai commerce : l'objectif est de prouver une compétence (tunnel d'achat + agent IA fiable), pas de vendre.
- Public visé : prospects freelance qui consultent devbrek.fr et veulent voir un cas concret d'agent IA appliqué à un contexte commercial.
- Nom du projet : à définir (chantier A).
- Univers produit : à définir (chantier A) — un seul univers, catalogue restreint (1 à 5 produits fictifs).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + Neon (PostgreSQL) — base dédiée à ce projet, distincte de celle de devbrek.fr
- Stripe en mode test (pas de vrai paiement)
- LangGraph pour l'agent de support (même framework qu'Arthur)
- pnpm, déploiement Vercel

## Cadre de travail avec Claude

- Protocole de chantier strict : phases séparées par des STOP explicites, diffs complets (jamais de récapitulatifs), critères d'acceptation binaires vérifiés par exécution, une variable à la fois.
- Mesurer avant de réparer : aucun critère validé sans exécution réelle.
- Sorties de périmètre : signalées et documentées, jamais traitées à la volée.
- Git : un fichier par commit, nommé explicitement, jamais `git add .`. Arbre propre avant tout nouveau chantier.
- Pas de dépendance ajoutée sans décision explicite, pas de classe Tailwind arbitraire entre crochets.
- Réponses courtes et séquentielles, une étape à la fois.

## Règle cardinale

- Ce qui est présenté sur le portfolio comme preuve de ce projet doit être vrai et vérifiable (comme pour Arthur) : pas de fonctionnalité affichée qui ne marche pas réellement en démo.
