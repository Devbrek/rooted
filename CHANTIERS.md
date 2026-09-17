# CHANTIERS.md

Suivi des chantiers, ordre alphabétique. Chantier fermé = déplacé dans la section "Fermés" avec date.

## Ouverts

### F — Agent IA de support

- Agent LangGraph, deux sources : RAG (recherche dans des textes indexés) sur les fiches produit et la politique de retour ; outil en lecture seule pour le statut de commande, qui relit la session Stripe. Décision : pas de table `Order`, Stripe reste la seule source de vérité.
- Outil « statut de commande » :
  - Entrée : identifiant de session uniquement, format vérifié avant tout appel Stripe (préfixe `cs_test_`). Jamais de recherche par email ou par nom.
  - Sortie en liste blanche : statut de paiement (payée / non payée), articles (nom, quantité), montant total. `customer_details` et tout autre champ de la session exclus.
  - Aucun statut de livraison : l'agent indique que la démo n'a pas de suivi d'expédition.
  - Session inconnue → « commande introuvable » ; panne Stripe → message distinct (même logique que `/confirmation`, chantier T).
  - Aucune écriture ni action sur Stripe (pas de remboursement, pas d'annulation).
- Critères d'acceptation :
  - Outil exécuté seul, hors agent : session payée → « payée », articles et montant identiques à la session relue via l'API ; session non payée → « non payée » ; `cs_test_` inexistant → introuvable.
  - `abc` et un identifiant `cs_live_…` → rejetés, 0 appel Stripe, avec contrôle positif (un identifiant valide produit bien 1 appel).
  - Confidentialité : session payée avec un email témoin saisi sur Stripe → 0 occurrence de cet email dans la sortie de l'outil, avec contrôle de l'outil de mesure (l'email témoin est présent dans la session relue directement via l'API).
  - Panne Stripe (clé surchargée au lancement, `.env` inchangé) → message distinct de « commande introuvable ».
  - Agent, test manuel (Ben) : 3 questions types (statut avec un identifiant de session payée, caractéristique d'un produit, politique de retour) → réponses correctes, sans information inventée.
- Prérequis : texte de politique de retour fictive, écrit et validé avant indexation, couvert par la mention du chantier I.
- Limites connues (pour H) : l'identifiant de session sert de preuve d'accès (lien au porteur, cf. `AUDIT-J.md`) ; pas de statut de livraison.
- Hors périmètre (signalé) : dépendances de l'agent (LangGraph, fournisseur de modèle, stockage de l'index RAG) à décider explicitement à l'ouverture de F ; garde-fous généraux (chantier G).

### G — Garde-fous de l'agent

- Comportement défini pour : information non trouvée, demande de remboursement, question hors périmètre.
- Critère d'acceptation : les 3 cas limites testés produisent le comportement attendu (pas d'invention, pas de décision autonome sur remboursement).

### H — Documentation et intégration portfolio

- Page dédiée sur devbrek.fr : schéma du flux agent, vidéo de démo, section limites connues.
- Critère d'acceptation : page publiée, cohérente avec la règle "vrai et vérifiable".

### K — Filtrage du catalogue

- Système de filtrage des produits sur la page catalogue (critère de filtrage à définir — 5 produits seulement en base).
- Critère d'acceptation : filtrer réduit effectivement la liste affichée, l'état vide est géré, testé manuellement.

### L — Enrichissement de la section "Notre démarche"

- Développer le contenu de la section (structure et texte), dans le ton validé.
- Critère d'acceptation : section enrichie, textes validés avant intégration, cohérents avec la mention du chantier I.

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

### W — Formulaire de livraison et de facturation validé

- Dépend de I : la mention « Projet démo : saisissez des informations fictives, rien n'est conservé » doit être affichée au-dessus du formulaire de `/commande`.
- Dépendance ajoutée, décidée explicitement : `zod`. Un seul schéma partagé entre le navigateur et le serveur. Version installée consignée dans le rapport du chantier.
- Champs de livraison : prénom (obligatoire, 50 caractères max), nom (obligatoire, 50 max), email (obligatoire, format valide), adresse (obligatoire, 100 max), complément d'adresse (facultatif, 100 max), code postal (obligatoire, exactement 5 chiffres), ville (obligatoire, 50 max), pays affiché « France » non modifiable. Pas de téléphone.
- Facturation : case « Adresse de facturation identique à la livraison », cochée par défaut. Décochée, elle affiche un second bloc (prénom, nom, adresse, complément, code postal, ville, pays France) soumis aux mêmes règles. Cochée, aucun champ de facturation n'est exigé ni validé.
- Validation côté navigateur (affichage des erreurs sous chaque champ) et côté serveur dans `/api/checkout`, avant tout appel Stripe. Formulaire invalide : HTTP 400, corps `{"error": "Formulaire invalide.", "fields": {...}}` avec un message en français par champ en erreur.
- Données jamais conservées : ni base de données, ni transmission à Stripe, ni écriture dans les logs. L'email est redemandé par Stripe (doublon assumé).
- Mise à jour de l'écran 4 de `WIREFRAME.md` incluse.
- Critères d'acceptation :
  - curl : champ obligatoire vide, email invalide, code postal à 4 chiffres, champ dépassant sa longueur maximale, case décochée avec bloc de facturation vide → HTTP 400 avec le champ concerné dans `fields`, 0 session Stripe créée (comptage depuis un horodatage, contrôlé par un test positif qui fait passer le compteur à 1).
  - curl : formulaire valide, case cochée → HTTP 200 ; formulaire valide, case décochée avec facturation valide → HTTP 200.
  - Session Stripe créée : aucune des valeurs saisies n'apparaît dans l'objet session relu via l'API.
  - Logs serveur : 0 occurrence d'une valeur témoin saisie dans le formulaire, avec contrôle de l'outil sur une ligne de log connue.
  - Non-régression : tous les critères de T repassent.
  - Test manuel (Ben), desktop et mobile : erreurs affichées sous les champs, bloc de facturation qui apparaît et disparaît avec la case, mention de I visible, redirection vers Stripe uniquement avec un formulaire valide.
- Hors périmètre (signalé) : stockage des informations client (lié à la décision sur la table `Order`), livraison hors France, téléphone.

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

### T — Correction des défauts serveur de l'audit J — fermé le 2026-09-15

- Phase 1 (`/api/checkout`) : plafond de 10 par produit appliqué à la quantité cumulée après fusion des doublons (un seul line item Stripe par produit), erreurs Stripe interceptées (`try/catch` limité à l'appel Stripe), réponse 500 avec message applicatif au lieu d'un corps vide. Défauts 1, 2 et 7 de `AUDIT-J.md` corrigés. Log serveur de l'erreur Stripe réduit à {type, code} (vérifié par lecture du diff, pas par exécution).
- Phase 2 (`/confirmation`) : distinction entre commande introuvable (`resource_missing` → HTTP 404 via `not-found.tsx`) et panne Stripe (toute autre erreur → HTTP ≥ 500 via `error.tsx`), au lieu d'un HTTP 200 uniforme. Défauts 3 et 4 corrigés.
- Test manuel (Ben) : panier à 11 unités, clic « Payer » → message d'erreur affiché, aucune redirection vers Stripe.
- Toutes les phases précédées d'une reproduction des défauts sur le code non modifié, tests exécutés sur `pnpm build` + `pnpm start`, contrôle positif rejoué après chaque test de panne, empreinte `.env` vérifiée inchangée.
- Défaut 5 (panier perdu au retour depuis Stripe) et plafond côté panier hors périmètre, reportés au chantier U. Défaut mineur 6 (variable morte) non traité. Sorties de périmètre non traitées : limite du nombre de lignes brutes et de la taille du corps avant fusion (liée au rate limiting, absent), format des montants `78.00 €`.

### U — Persistance du panier — fermé le 2026-09-15

- Panier persisté dans `localStorage` (clé `rooted-cart-v1`, `productId` et quantité uniquement). Nom et prix relus depuis la liste de produits fournie par le layout (Prisma). Relecture défensive : JSON invalide, quantité hors 1–10, produit inconnu et doublons de `productId` ignorés. Clé supprimée quand le panier est vide et après paiement vérifié. Défaut 5 de `AUDIT-J.md` corrigé.
- Plafond de 10 par produit côté panier : champ borné, saisie supérieure ramenée à 10, message « 10 maximum par produit ».
- Tests manuels (Ben) sur `pnpm build` + `pnpm start`, desktop et mobile : rechargement, annulation Stripe, carte refusée, bouton retour, paiement abouti (clé absente), valeur corrompue, quantité 11, doublon, saisie de 15, `/confirmation?session_id=abc` en 404 avec panier conservé. Contrôle positif `/api/checkout` : `amount_total: 10500`.
- Limites connues : `/`, `/commande` et `/panier` sont statiques, la liste de produits servant à la réhydratation est donc figée au build (sans effet sur un catalogue fixe, `/api/checkout` relit toujours la base) ; pas de synchronisation entre onglets ouverts simultanément.

### I — Mention « site factice » — fermé le 2026-09-17

- Bandeau « Site de démonstration : boutique, produits et paiement fictifs. Aucun achat réel, rien ne sera débité. » monté dans le layout, présent sur les 5 écrans (vérifié par curl sur le HTML servi, contrôle de l'outil inclus, et visuellement par Ben en desktop et mobile).
- Encart sur `/commande` au-dessus du bouton « Payer » : carte de test 4242 4242 4242 4242, date future, code à 3 chiffres, informations fictives uniquement. Vérifié visuellement par Ben (composant client : non vérifiable par curl, qui ne voit que le panier vide).
- Débloque N, P, Q, R et W.

### X — Bandeau fin sur la confirmation — fermé le 2026-09-17

- Photo pleine hauteur de `/confirmation` remplacée par `ThinBanner` (même gabarit que le panier et le checkout) : message de confirmation visible sans défilement. Écran 5 de `WIREFRAME.md` mis à jour.
- Vérifié visuellement par Ben sur `pnpm build` + `pnpm start`, desktop et mobile, avec une session payée.

### V — Ajout au panier depuis la fiche produit et montant dans le header — fermé le 2026-09-17

- Sélecteur − / + sur la fiche produit (maximum 10 − unités déjà au panier, mention « Déjà N dans votre panier », blocage et message « 10 maximum par produit » à 10). `addItem` accepte une quantité, plafonnée à 10.
- Toast écrit à la main : quantité réellement ajoutée, nom du produit, lien « Voir le panier », visible 7 secondes, relancé à chaque ajout, annoncé via aria-live.
- Header : montant total au format français, masqué quand le panier est vide, calculé depuis les prix fournis par le layout.
- Lint : 0 problème. Règle `react-hooks/set-state-in-effect` désactivée localement sur l'effet d'hydratation de `cart-context.tsx` (chantier U), justifiée par la lecture de `localStorage` au montage ; comportement inchangé.
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : ajout de N unités, plafond à 7 puis 10, toast et relance, montant du header, rechargement ; non-régression des tests 1, 3 et 7 de U. Écran 2 de `WIREFRAME.md` mis à jour.

### M — Navigation et logo — fermé le 2026-09-17

- Accueil : header à sa place normale en haut de page ; une fois le hero dépassé (IntersectionObserver, sans dépendance), une barre fixe apparaît en fondu avec glissement (300 ms), masquée et non focusable tant que le hero est visible, sans animation si l'utilisateur réduit les mouvements. Autres pages : header collant (`sticky top-0`).
- Logo agrandi d'un cran, proportions conservées.
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : apparition et disparition de la barre au passage du hero sur l'accueil, header collant sur les 4 autres écrans, liens et compteur fonctionnels, toast visible au-dessus du header.

### M-bis — Header transparent sur le hero — fermé le 2026-09-17

- Remplace la seconde barre fixe du chantier M : un seul header collant, transparent (texte blanc, logo clair `rootedWhite2.svg`) posé sur le hero de l'accueil, qui devient blanc en fondu (300 ms, logo `rooted2.svg`) une fois le hero dépassé (IntersectionObserver, sans dépendance, sans animation si l'utilisateur réduit les mouvements). Autres pages : header blanc collant.
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : passage transparent → blanc et retour sur l'accueil, lisibilité sur la photo, header blanc collant sur les 4 autres écrans, liens, compteur et toast fonctionnels.

### M-ter — Menu mobile — fermé le 2026-09-17

- Sous `sm` : liens (Catalogue, Panier) regroupés dans un panneau ouvert par un bouton (icône hamburger/croix en SVG écrit à la main), `aria-expanded` et `aria-controls="mobile-menu"`. Panneau à fond opaque `bg-white`, y compris sur le hero transparent.
- Fermeture par Échap (écouteur `document`, `setState` uniquement dans le callback), par clic sur un lien du panneau, et au changement de page (ajustement d'état pendant le rendu par comparaison du `pathname`, sans effet, pour rester conforme à la règle sur `setState` dans les effets).
- Logo distinct sous `sm` : `Rsolo.svg` / `RsoloWhite.svg` (le « R » seul) ; à partir de `sm`, `rooted2.svg` / `rootedWhite2.svg` inchangés. Desktop non modifié par ailleurs (liens directs dans le header, pas de bouton menu).
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : ouverture/fermeture, Échap, clic sur un lien, lisibilité sur le hero, navigation au clavier, logo « R » sur petit écran, desktop inchangé.
- Limites connues : pas de piégeage de focus (focus trap) dans le panneau au-delà de la fermeture par Échap ; pas de blocage du défilement de la page derrière le panneau ouvert.

### N — Formulaire de contact et inscription mail (factices) — fermé le 2026-09-17

- Page `/contact` : formulaire de contact (prénom, email, message) et formulaire d'inscription newsletter (email), chacun avec sa propre validation côté navigateur (champs obligatoires, format d'email), erreurs affichées sous chaque champ (`aria-invalid`, `aria-describedby`).
- À l'envoi d'un formulaire valide : aucune requête réseau, aucune donnée stockée, champs réinitialisés, message « Site de démonstration : aucun message n'est envoyé ni conservé. » affiché. Mention factice permanente au-dessus des deux formulaires.
- Lien « Contact » ajouté dans le header, desktop et menu mobile (chantier M-ter).
- Vérification : `grep` sur `app/contact/page.tsx` et `components/header.tsx` montrant 0 occurrence de `fetch(`, `localStorage` et `console.log`, avec contrôle positif sur `handleContactSubmit`.
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : erreurs de validation affichées, message de démonstration après envoi valide, onglet Network vide lors de l'envoi, lien du header fonctionnel.

### Y — Blog factice — fermé le 2026-09-17

- Données dans `lib/blog-posts.ts` (pas de base, pas de CMS, pas de dépendance) : 3 articles fictifs sur l'univers Rooted (ambiance, entretien des matières, rituels apaisants), textes validés par Ben avant intégration, chacun avec une photo déjà présente dans `public/` (`tirage-brume-matin.jpg`, `plaid-refuge.jpg`, `bougie-sous-bois.jpg`).
- Page `/blog` (liste, Server Component) et `/blog/[slug]` (article, Server Component, `generateStaticParams`) ; slug inconnu → `notFound()`. Mention « Article fictif » visible sur chaque article, en plus du bandeau du chantier I.
- Lien « Blog » ajouté dans le header, desktop et menu mobile ; liens de navigation desktop (Catalogue, Blog, Contact) recentrés dans le header, logo à gauche et Panier/menu à droite inchangés.
- Tests manuels (Ben), desktop et mobile, sur `pnpm build` + `pnpm start` : les 3 articles s'affichent depuis la liste, mention fictive visible, lien du header fonctionnel, navigation centrée.
- Non vérifié par l'assistant (Ben gère le serveur) : comportement HTTP réel (404 sur slug inconnu, 200 sur slug valide) — à confirmer par Ben via `curl`, la structure du code (`if (!post) notFound()`) suit le même modèle déjà validé sur `/produits/[id]`.
