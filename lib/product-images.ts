// Association explicite produit → photo réelle dans public/. Pas de règle de
// nommage devinée : chaque photo listée dans public/ est reliée à la main à
// l'id du produit correspondant en base.
const PRODUCT_IMAGES: Record<string, string> = {
  clr1bougiesousbois0001: "/bougie-sous-bois.jpg",
  clr2diffuseurclairier02: "/diffuseur-clairiere.jpg",
  clr3tiragebrumematin003: "/tirage-brume-matin.jpg",
  clr4plaidrefuge00000004: "/plaid-refuge.jpg",
  clr5coussinmousse000005: "/coussin-mousse.jpg",
};

// Retourne null si aucune photo n'est connue pour ce produit, pour permettre
// un repli explicite plutôt que de charger une image inexistante.
export function getProductImage(productId: string): string | null {
  return PRODUCT_IMAGES[productId] ?? null;
}
