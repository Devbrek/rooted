# Audit J — Sécurité du tunnel de paiement

**Date de l'audit :** 15 septembre 2026
**Commit audité :** `6cedffc2b7263727c94898a35ec2b8689ea5ad18` (« docs : md »)
**Nature :** audit en lecture et en exécution uniquement. Aucune modification du code source n'a été effectuée pendant ce chantier.
**Environnement de test :** serveur `pnpm dev` local, clés Stripe de test.

---

## Périmètre audité

| Fichier | Type | Rôle |
|---|---|---|
| `app/api/checkout/route.ts` | Route Handler (serveur) | Valide le panier reçu, relit les prix en base via Prisma, crée la session Stripe Checkout. |
| `app/commande/page.tsx` | `"use client"` | Récapitulatif panier + formulaire non exploité + bouton « Payer » (POST `/api/checkout`, redirection vers Stripe). |
| `app/confirmation/page.tsx` | Server Component | Relit la session Stripe côté serveur, n'affiche la confirmation que si `payment_status === "paid"`. |
| `app/panier/page.tsx` | `"use client"` | Page panier : liste, quantités, suppression. |
| `lib/stripe.ts` | Module serveur | Instancie le client Stripe avec `STRIPE_SECRET_KEY`. |
| `lib/prisma.ts` | Module serveur | Client Prisma (adapter Neon). |
| `components/cart-context.tsx` | `"use client"` | Contexte panier, état en mémoire (`useState`), **sans persistance**. |
| `components/add-to-cart-button.tsx`, `components/header.tsx` | `"use client"` | Ajout au panier / compteur d'articles. |
| `components/clear-cart-on-mount.tsx` | `"use client"` | Vide le panier au montage, utilisé sur `/confirmation` après vérification du paiement. |
| `app/layout.tsx` | Server Component | Fournit le `CartProvider` à toute l'app. |
| `.env` | — | `DATABASE_URL`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (valeurs jamais affichées). |
| `.gitignore` | — | `.env*` ignoré (ligne 34). |

**Format du corps attendu par `POST /api/checkout`** :
```json
{ "items": [ { "productId": "string", "quantity": "integer > 0" } ] }
```

**URLs Stripe** : `success_url: {origin}/confirmation?session_id={CHECKOUT_SESSION_ID}` — `cancel_url: {origin}/commande`, `origin` dérivé de `request.nextUrl.origin`.

**Webhook Stripe** : absent (aucune route `api/webhook*`, aucun `constructEvent` dans le code).

---

## Point 1 — Aucune clé secrète exposée côté client

| Test | Attendu | Obtenu | Verdict |
|---|---|---|---|
| Préfixe `NEXT_PUBLIC_` sur la clé secrète | Absent | Seule `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (clé publique) porte ce préfixe | OK |
| `lib/stripe.ts` importé par un fichier `"use client"` | Non | Seuls `app/api/checkout/route.ts` et `app/confirmation/page.tsx` importent `stripe`, aucun des deux n'a `"use client"` | OK |
| `sk_test_`/`sk_live_` dans `.next/static` après `pnpm build` | 0 occurrence | 0 fichier, 0 occurrence | OK |
| Contrôle de l'outil : texte connu (`Redirection vers Stripe`, `app/commande/page.tsx`) dans `.next/static` | ≥ 1 fichier | 1 fichier trouvé | OK — l'outil de mesure est fiable |
| Contrôle de l'outil : texte connu (`Catalogue`, `components/header.tsx`) dans `.next/static` | ≥ 1 fichier | 1 fichier trouvé | OK |
| Fichiers `.env*` trackés par Git | Aucun | `git ls-files` : aucune ligne `.env*` | OK |
| `sk_test_`/`sk_live_` dans tout l'historique Git | 0 | 0 occurrence | OK |
| Contrôle de l'outil : motif connu (`CHANTIERS`) dans `git log --all -p` | ≥ 1 | 4 occurrences | OK — l'outil de mesure est fiable |
| Réponse d'erreur de `/api/checkout` sans clé ni trace | — | Voir Point 4 (Phase 5) — corps vide, 0 fuite constatée | OK |
| Clé publique seule clé Stripe dans le bundle client (contrôle positif) | — | **Sans objet** : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` n'est référencée dans aucun fichier source (ni `loadStripe`, ni `@stripe/stripe-js`) ; ni son nom ni un motif `pk_test_`/`pk_live_` n'apparaissent dans `.next/static` | Sans objet |

## Point 2 — Prix relus en base côté serveur

Prix de référence (lus via Prisma, mêmes modèles que ceux utilisés par `route.ts`) :

| productId | Prix DB |
|---|---|
| `clr1bougiesousbois0001` | 28,00 € |
| `clr2diffuseurclairier02` | 49,00 € |
| `clr3tiragebrumematin003` | 39,00 € |
| `clr4plaidrefuge00000004` | 89,00 € |
| `clr5coussinmousse000005` | 34,00 € |

**Contrôle positif** : `{items:[{clr1×2},{clr2×1}]}` → HTTP 200, session Stripe, `amount_total: 10500` (= 105,00 € = 28×2+49). **OK.**

| # | Test | Attendu | Obtenu | Verdict |
|---|---|---|---|---|
| 1 | Prix falsifié ajouté (`price:0.01`) | Prix DB utilisé | HTTP 200, `amount_total: 2800` (28,00 €, prix DB, pas 0,01 €) | OK |
| 2 | `productId` inexistant | 4xx, aucune session | HTTP 400 `"Un ou plusieurs produits du panier sont introuvables."` | OK |
| 3 | Quantité 0 | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 4 | Quantité négative | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 5 | Quantité décimale (1.5) | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 6 | Quantité non numérique | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 7 | Quantité très grande (100000) | — | **HTTP 200**, session créée, `amount_total: 280000000` (2 800 000,00 €). Aucun rejet, ni côté validation applicative ni côté Stripe. | **DÉFAUT** — gravité : à corriger |
| 8 | Panier vide | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 9 | JSON malformé | 4xx | HTTP 400 `"Panier invalide."` | OK |
| 10 | Méthode GET | 4xx | HTTP 405, corps vide | OK |
| 11 | Header `Host` forgé | — | HTTP 200, `success_url`/`cancel_url` construits sur l'origine réelle de connexion (`localhost:3000`), le `Host` forgé est ignoré | **OK en local, non vérifié en production** (dépend de la façon dont Vercel transmet l'origine, non testable en local) |
| 12 | `productId` dupliqué | Prix correct | HTTP 200, 2 line items séparés (pas de fusion), total correct (`8400` = 84,00 € = 28×3) | OK (non-fusion = cosmétique) |
| 13 | 200 lignes valides | Pas de fuite | **HTTP 500, corps vide (0 octet)**. Cause (log serveur) : `Error: You may not specify more than 100 line items.` — aucun `try/catch` autour de l'appel Stripe. Pas de fuite constatée. | **DÉFAUT** — gravité : à corriger |

## Point 3 — Session Stripe vérifiée avant confirmation

| # | Test | Code HTTP | Contenu affiché | `ClearCartOnMount` invoqué ? | Verdict |
|---|---|---|---|---|---|
| 1 | `/confirmation` sans `session_id` | 200 | « Commande introuvable » | Non (vérifié : 0 occurrence du composant lui-même, hors tag `<script>` de préchargement générique) | OK |
| 2 | `session_id=abc` (invalide) | 200 | « Commande introuvable » | Non | OK |
| 3 | Session réelle créée mais **non payée** | 200 | « Commande introuvable » | Non | OK |
| 4 (contrôle positif) | Session réellement **payée** | 200 | « Merci, votre commande est confirmée » | **Oui** | OK |

Données personnelles affichées sur la page de confirmation : identifiant de session Stripe, nom des articles, quantité, montant par ligne, montant total. **Aucun email, nom ou adresse** (le code ne lit que `session.id`, `session.line_items`, `session.amount_total`).

L'URL de confirmation est un lien au porteur : toute personne qui la possède peut réafficher la page (articles, montant). Aucune donnée personnelle affichée, acceptable pour la démo.

## Point 4 — Gestion des cas d'échec

| # | Test | Attendu | Obtenu | Verdict |
|---|---|---|---|---|
| 1 | Stripe indisponible / clé invalide — `POST /api/checkout` | 5xx générique, sans clé ni trace | HTTP 500, corps vide (0 octet), 0 fuite constatée | OK (message vide plutôt que JSON cohérent — cf. défauts) |
| 1 (suite) | `/confirmation` avec session payée, sur instance à clé invalide | — | HTTP 200, « Commande introuvable » (le `catch` interne absorbe l'erreur Stripe) | **DÉFAUT** — voir ci-dessous |
| 1 (suite) | Rejeu du contrôle positif après retour à la config normale | Fonctionnement normal | HTTP 200, `amount_total: 10500`, identique à l'origine | OK — serveur fonctionnel après redémarrage |
| 2 | Annulation sur `cancel_url` | Décrire, ne pas corriger | Panier non conservé (pas de persistance dans `CartProvider`) : `/commande` chargé à nouveau affiche « Votre panier est vide. » | Confirmé par lecture du code et par test manuel navigateur |
| 3 | Carte refusée (manuel, réalisé par Ben) | Refus propre côté Stripe | a) Carte `4000 0000 0000 0002` → paiement refusé, message affiché par Stripe. b) L'utilisateur reste sur la page Stripe, `/confirmation` non atteinte. c) Retour via lien d'annulation Stripe → panier vide. d) Retour via bouton retour du navigateur → panier vide également (pas de restauration par le cache navigateur) | OK pour b) — DÉFAUT d'expérience pour c)/d) (voir ci-dessous) |
| 4 | Double chargement `/confirmation`, même session payée | Pas d'effet de bord | Contenu strictement identique aux deux chargements. Aucune écriture, aucun envoi : `getPaidSession` ne fait qu'un appel Stripe en lecture seule, `ClearCartOnMount` est idempotent (aucun appel réseau) | OK |

---

## Limites de l'audit

- Tous les tests ont été exécutés sur le serveur de développement local.
- Le bundle servi en production (Vercel) n'a pas été inspecté.
- Le test 11 (Host forgé) n'est pas vérifié en production.
- Aucune limitation de débit n'a été testée.

## Défauts constatés

Aucune correction n'a été appliquée — description factuelle uniquement.

| # | Défaut | Description factuelle | Gravité |
|---|---|---|---|
| 1 | Absence de plafond sur la quantité | Une quantité de 100000 (ou plus) est acceptée sans rejet, ni par la validation applicative (`isValidRequestBody` ne vérifie que `Number.isInteger && > 0`) ni par Stripe à la création de session. Une session de 2 800 000,00 € a été créée sans erreur. | à corriger |
| 2 | Absence de `try/catch` autour des appels Stripe dans `/api/checkout` | Au-delà de 100 line items, ou avec une clé Stripe invalide, l'exception Stripe n'est pas interceptée : la route renvoie une erreur 500 générique avec un **corps vide**, au lieu d'un message applicatif cohérent (`{"error": "..."}`comme pour les cas 400). Aucune fuite de clé ou de trace constatée dans le corps de réponse. | à corriger |
| 3 | `/confirmation` renvoie HTTP 200 pour une commande introuvable | Les cas « pas de session_id », « id invalide » et « session non payée » renvoient tous un code HTTP 200 avec le message « Commande introuvable », au lieu d'un code 404. | mineur |
| 4 | Panne Stripe et commande inexistante non distinguées sur `/confirmation` | En cas d'indisponibilité de Stripe (clé invalide testée), `/confirmation` affiche « Commande introuvable » même pour l'identifiant d'une session réellement payée — le `catch` interne de `getPaidSession` traite panne technique et absence de commande de la même façon, sans distinction pour l'utilisateur ni de code d'erreur différent. | à corriger |
| 5 | Perte du panier au retour depuis Stripe | Le panier (`CartProvider`) est un état React en mémoire, sans persistance (pas de `localStorage`, pas de cookie). Toute navigation vers `checkout.stripe.com` décharge ce runtime. Confirmé par lecture du code et par test manuel navigateur (Ben) : le panier est vide aussi bien après une annulation, un refus de carte, que via le bouton retour du navigateur (pas de restauration par le cache). L'utilisateur doit tout réajouter après tout aller-retour vers Stripe sans paiement abouti. | à corriger |
| 6 | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : variable morte | Déclarée dans `.env`, jamais référencée dans le code (pas de `loadStripe`, pas de `@stripe/stripe-js`, pas d'usage du nom de la variable). Confirmé absente de `.next/static` (0 occurrence de son nom et des motifs `pk_test_`/`pk_live_`). | mineur |
| 7 | Doublons de `productId` non fusionnés | Deux lignes avec le même `productId` créent deux line items Stripe séparés au lieu d'être fusionnées en une seule ligne avec quantité cumulée. Le prix total reste correct ; effet purement cosmétique sur la page Stripe (le même produit apparaît deux fois). | mineur |

---

## Tests manuels à faire par Ben

- **Test 3 (carte refusée)** : réalisé — résultats intégrés au Point 4 ci-dessus.
- Aucun autre test manuel obligatoire restant à ce stade.
- Optionnel, non réalisable en local : vérifier en environnement de production réelle (Vercel) le comportement de `success_url`/`cancel_url` face à un header `Host` forgé (Test 11, Point 2) — dépend de la façon dont Vercel transmet l'origine à l'application.

---

## Sorties de périmètre signalées

- **Absence de webhook Stripe** — confirmé (aucune route `api/webhook*`, aucun `stripe.webhooks.constructEvent` dans le code). Seul mécanisme de confirmation : relecture directe de la session côté serveur (pull), pas de webhook (push).
- **Table `Order` / persistance de commande** — aucune commande n'est stockée en base ; le commentaire du code (`app/commande/page.tsx`) référence explicitement un chantier séparé pour ce point. Décision à prendre avant le chantier F (l'agent doit pouvoir répondre sur le statut des commandes).
- **Limitation de débit (rate limiting)** — absente sur `/api/checkout`, non traitée dans cet audit.
- **Formulaire de `/commande` affiché mais non exploité** (champs nom/email/adresse non envoyés ni utilisés) — à rattacher aux chantiers I/N.
- **Format d'affichage des montants** — `78.00 €` (point) au lieu de `78,00 €` (virgule, format français attendu) — cosmétique, non traité.

---

*Fin du rapport. Aucun commit effectué — en attente de l'accord de Ben.*
