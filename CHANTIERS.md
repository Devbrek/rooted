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

### T — Correction des défauts serveur de l'audit J

- Corrige les défauts 1, 2, 3, 4 et 7 de `AUDIT-J.md`. Fichiers visés : `app/api/checkout/route.ts`, `app/confirmation/page.tsx` (et le module de `getPaidSession` s'il est séparé).
- Ordre de validation imposé dans `/api/checkout` : 1) chaque ligne a une quantité entière > 0, 2) produits inconnus rejetés, 3) doublons de `productId` fusionnés, 4) plafond de 10 appliqué à la quantité cumulée par produit.
- Phase 0 (reproduction, avant toute modification) : rejouer sur le code actuel les tests 7 et 13 du Point 2, le test de clé invalide du Point 4, les tests 1 à 3 du Point 3, et noter ce que `/commande` affiche aujourd'hui sur une réponse 400 (test manuel navigateur par Ben). Chaque échec constaté est consigné avec sa commande et sa sortie.
- Critères d'acceptation (tests exécutés sur `pnpm build` + `pnpm start`) :
  - Quantité 100000 sur un produit → HTTP 400, corps `{"error": "Quantité maximale dépassée (10 par produit)."}`, aucune session créée.
  - Trois lignes du même produit à 4 chacune (cumul 12) → HTTP 400, même message.
  - Deux lignes du même produit à 2 et 3 → HTTP 200, un seul line item de quantité 5 dans la session Stripe.
  - 200 lignes du même produit → HTTP 400 (plafond), plus de HTTP 500.
  - Clé Stripe invalide, `POST /api/checkout` avec panier valide → HTTP 500, corps `{"error": "Le paiement est momentanément indisponible."}` non vide, aucune clé ni trace dans le corps.
  - `/confirmation` sans `session_id`, avec `session_id=abc`, et avec une session non payée → HTTP 404 et message « Commande introuvable ».
  - `/confirmation` avec une session payée, clé invalide → code HTTP ≥ 500, message « Impossible de vérifier votre commande pour le moment. » (distinct de « Commande introuvable »), `ClearCartOnMount` non invoqué.
  - Test manuel (Ben) : panier monté à 11 unités d'un produit, clic sur « Payer » dans `/commande` → message d'erreur lisible affiché, aucune redirection vers Stripe.
  - Non-régression : contrôle positif `amount_total: 10500` ; tests 1 à 6 et 8 à 10 du Point 2 inchangés ; session payée avec clé valide → HTTP 200, confirmation affichée, `ClearCartOnMount` invoqué ; 0 occurrence `sk_test_`/`sk_live_` dans `.next/static`, avec contrôle de l'outil sur un motif connu.
  - Clé restaurée dans `.env` en fin de chantier, contrôle positif rejoué après restauration, aucune valeur de clé affichée.
- Hors périmètre (signalé) : plafond côté panier et persistance (chantier U), limite du nombre de lignes brutes et de la taille du corps avant fusion (rate limiting), variable morte `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (défaut 6), format `78.00 €`.

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

### J — Audit de sécurité du tunnel de paiement — fermé le 2026-09-15

- Audit en lecture et exécution sur 4 points (clé secrète, prix relus en base, vérification de la session avant confirmation, cas d'échec), rapport complet dans `AUDIT-J.md`. Aucune fuite de clé, prix non falsifiables, confirmation conditionnée au paiement réel.
- Défauts à corriger (chantier de correction à créer) : absence de plafond de quantité, erreurs Stripe non interceptées dans `/api/checkout`, panne Stripe confondue avec commande introuvable sur `/confirmation`, panier perdu au retour depuis Stripe. Trois défauts mineurs consignés dans le rapport.
- Limite : tests exécutés en local uniquement, production non inspectée.
