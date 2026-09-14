// Association explicite produit → texte "Matière & entretien" (même principe
// que lib/product-images.ts). Chaque texte reformule ce qui est déjà dans la
// description en base et ajoute un conseil d'entretien évident pour ce type
// d'objet — aucune composition chiffrée, température ou certification
// inventée.
const PRODUCT_CARE: Record<string, string> = {
  clr1bougiesousbois0001:
    "Verre ambré et cire parfumée. Éteindre avant de quitter la pièce, à l'abri de la lumière directe.",
  clr2diffuseurclairier02:
    "Bois clair et mécanisme à ultrasons. Un chiffon sec suffit à l'entretenir, à l'abri du soleil direct.",
  clr3tiragebrumematin003:
    "Tirage sur papier mat. À conserver à l'abri de la lumière directe pour préserver les couleurs.",
  clr4plaidrefuge00000004:
    "Laine mérinos. Un lavage doux et un séchage à plat suffisent à le garder souple.",
  clr5coussinmousse000005:
    "Tissu bouclette texturé. Un dépoussiérage régulier et un nettoyage doux suffisent à préserver sa texture.",
};

// Retourne null si aucun texte n'est connu pour ce produit, pour permettre à
// l'appelant de ne pas afficher le bloc plutôt que d'inventer un contenu.
export function getProductCare(productId: string): string | null {
  return PRODUCT_CARE[productId] ?? null;
}
