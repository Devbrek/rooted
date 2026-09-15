# CHANTIERS.md

Suivi des chantiers, ordre alphabétique. Chantier fermé = déplacé dans la section "Fermés" avec date.

## Ouverts

### F — Agent IA de support

- Agent LangGraph avec RAG sur les données produit/commandes (statut commande, caractéristiques produit, politique de retour).
- Critère d'acceptation : l'agent répond correctement à 3 questions types testées manuellement (statut, produit, retour).

### G — Garde-fous de l'agent

- Comportement défini pour : information non trouvée, demande de remboursement, question hors périmètre.
- Critère d'acceptation : les 3 cas limites testés produisent le comportement attendu (pas d'invention, pas de décision autonome sur remboursement).

### H — Documentation et intégration portfolio

- Page dédiée sur devbrek.fr : schéma du flux agent, vidéo de démo, section limites connues.
- Critère d'acceptation : page publiée, cohérente avec la règle "vrai et vérifiable".

### I — Mention "site factice"

- Mention explicite et visible que le site est une démo (produits, avis, boutiques, réseaux sociaux fictifs), au-delà de la ligne actuelle du footer.
- Prérequis des chantiers N, P, Q, R (tout contenu fictif ajouté doit être couvert par cette mention).
- Critère d'acceptation : mention visible sur les 5 écrans, formulée sans ambiguïté, vérifiée à l'affichage.

### J — Audit de sécurité du tunnel de paiement

- Revue ciblée : aucune clé secrète exposée côté client, prix relus en base côté serveur, session Stripe vérifiée avant confirmation, gestion des cas d'échec.
- Critère d'acceptation : chaque point vérifié par exécution (test négatif + contrôle positif), résultats consignés.

### K — Filtrage du catalogue

- Système de filtrage des produits sur la page catalogue (critère de filtrage à définir — 5 produits seulement en base).
- Critère d'acceptation : filtrer réduit effectivement la liste affichée, l'état vide est géré, testé manuellement.

### L — Enrichissement de la section "Notre démarche"

- Développer le contenu de la section (structure et texte), dans le ton validé.
- Critère d'acceptation : section enrichie, textes validés avant intégration, cohérents avec la mention du chantier I.

### M — Navigation et logo

- Navbar complétée, fixée en haut au défilement une fois le hero dépassé ; logo davantage mis en avant.
- Critère d'acceptation : comportement au défilement vérifié en desktop et mobile, navigation fonctionnelle sur les 5 écrans.

### N — Formulaire de contact et inscription mail (factices)

- Formulaire de contact et champ d'inscription à une newsletter, sans envoi ni collecte réelle.
- Critère d'acceptation : aucune donnée personnelle réellement stockée ni transmise ; caractère factice explicite à l'écran.

### P — Avis clients factices

- Avis avec notation en étoiles, contenu fictif.
- Critère d'acceptation : caractère fictif explicite, aucune attribution à une personne réelle ou identifiable.

### Q — Emplacements de boutique factices

- Carte affichant de faux points de vente (bibliothèque cartographique à décider — dépendance à valider explicitement).
- Critère d'acceptation : caractère fictif explicite, dépendance validée avant installation.

### R — Liens de réseaux sociaux factices

- Icônes de réseaux sociaux dans le footer, sans lien vers des comptes réels.
- Critère d'acceptation : aucun lien sortant vers un compte inexistant ou appartenant à un tiers ; caractère fictif explicite.

### S — Produits en favoris

- Possibilité de marquer des produits en favori (portée à définir : état client seul ou persistance).
- Critère d'acceptation : ajout/retrait d'un favori reflété dans l'interface, comportement testé manuellement.

## Fermés

### A — Définir le produit — fermé le 2026-09-15

- Univers retenu : décoration d'ambiance nature apaisante. Projet nommé "Rooted". 5 produits écrits dans `products.seed.json`.

### B — Maquette — fermé le 2026-09-15

- Wireframe texte des 5 écrans validé dans `WIREFRAME.md`, direction artistique dérivée du thème Dolomia (structure uniquement).

### C — Setup technique — fermé le 2026-09-15

- Next.js 16 + TypeScript + Tailwind 4 + pnpm, Prisma 7 + adapter Neon, table `Product` créée et peuplée (insertion SQL directe — le script de seed a été abandonné, incompatibilité ESM du générateur `prisma-client`).
- Arborescence des 5 routes créée, `lib/prisma.ts` en place.

### D — Catalogue et panier — fermé le 2026-09-15

- Catalogue lu depuis Neon, fiche produit avec 404 sur id inconnu, contexte panier React (sans persistance), page panier avec totaux et état vide.

### D-bis — Navigation (chantier intermédiaire) — fermé le 2026-09-15

- Header partagé (logo, catalogue, panier avec compteur d'articles) et footer minimal montés dans le layout.

### E — Paiement Stripe test — fermé le 2026-09-15

- Route `POST /api/checkout` créant la session Stripe à partir des prix relus en base, page `/commande`, page `/confirmation` avec vérification serveur du `payment_status`.
- Parcours complet exécuté et revérifié via l'API Stripe ; test négatif sur `session_id` invalide.

### E-bis — Style et identité visuelle (chantier intermédiaire) — fermé le 2026-09-15

- Palette et polices déclarées en jetons, 5 écrans stylisés, vraies photos branchées, icônes SVG écrites à la main, mention "Projet démo — produits fictifs" au footer.
