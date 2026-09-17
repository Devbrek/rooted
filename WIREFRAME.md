# WIREFRAME.md — Chantier B (validé)

Projet : **Rooted**

Univers produit : décoration d'ambiance "nature apaisante" (brume, forêt, bois, tons doux — vert sauge, beige, noir).
Ton : calme, chill, jamais "vente agressive". Inspiration visuelle : photo pleine largeur, badge prix en médaillon, typo serif espacée, accent doré/sable sur les CTA (référence structurelle : thème Dolomia, non réutilisé tel quel — code écrit de zéro).

Contrainte transversale : uniquement des photos libres de droit (Unsplash/Pexels), aucune fausse allégation technique ou commerciale (règle cardinale "vrai et vérifiable").

---

## Écran 1 — Accueil / Catalogue

1. Hero plein écran : photo forêt/brume, titre doux (ex. "Un peu de nature chez soi"), sous-titre court, un seul bouton "Découvrir la collection".
2. Bloc "Notre démarche" : texte court centré, ton sobre.
3. Trois arguments avec icônes (à préciser plus tard, ex. matières naturelles / fabrication responsable / livraison soignée).
4. Grille catalogue : cartes produit (photo carrée, badge prix en médaillon, nom), clic → fiche produit.
5. Bloc citation plein écran sur fond photo sombre (texte à écrire plus tard — citation de marque, pas un faux témoignage client).
6. Footer simple (liens, pas de vraie collecte email).

## Écran 2 — Fiche produit

1. Une seule photo grand format par produit (photo d'ambiance, pas de packshot).
2. Nom, prix, description courte (1-2 phrases), sélecteur de quantité (− / +, plafond de 10 par produit, mention des unités déjà au panier), bouton "Ajouter au panier", notification temporaire de confirmation avec lien vers le panier.
3. Bloc "Matière & entretien" formulé simplement, sans specs techniques inventées.
4. Bandeau "produits similaires" en bas (3 autres cartes du catalogue).

## Écran 3 — Panier

1. Bandeau photo fin en haut (même esthétique brume/forêt), titre "Votre panier" en surimpression.
2. Articles en mini-cartes soignées : photo carrée, nom, prix unitaire, quantité, prix ligne, suppression.
3. Encart récapitulatif (fond beige clair) : sous-total, total.
4. Bouton "Passer commande" en accent doré/sable.
5. État vide : même bandeau photo, message centré + retour catalogue.

## Écran 4 — Checkout

1. Bandeau photo fin en haut, titre "Finaliser la commande" (même gabarit que le panier).
2. Formulaire minimal : nom, email, adresse.
3. Récapitulatif de commande en encart beige (articles + total figé).
4. Emplacement bouton "Payer" → redirection Stripe Checkout (intégration = chantier E).
5. Pas de logos de paiement ni mentions de sécurité non vérifiables.

## Écran 5 — Confirmation

1. Bandeau photo fin en haut (même gabarit que le panier et le checkout), titre "Commande confirmée" en surimpression, pas d'effet "célébration".
2. Message court "Merci, votre commande est confirmée" + numéro de commande fictif.
3. Rappel des articles commandés (mini-cartes format panier).
4. Bouton discret "Retour au catalogue".
5. Mention visible : projet démo, paiement en mode test.

---

Critère d'acceptation chantier B (CHANTIERS.md) : ce document texte, couvrant les 5 écrans, sert de maquette validée avant tout code front.
