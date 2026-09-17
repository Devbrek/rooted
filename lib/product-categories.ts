// Correspondance produit → catégorie (même principe que lib/product-images.ts),
// à partir des 5 produits réels en base :
// - Bougie Sous-bois (clr1bougiesousbois0001)   → Ambiance
// - Diffuseur Clairière (clr2diffuseurclairier02) → Ambiance
// - Tirage Brume du matin (clr3tiragebrumematin003) → Décoration murale
// - Plaid Refuge (clr4plaidrefuge00000004)      → Textile
// - Coussin Mousse (clr5coussinmousse000005)    → Textile
export type ProductCategory = "Ambiance" | "Textile" | "Décoration murale";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Ambiance",
  "Textile",
  "Décoration murale",
];

const CATEGORY_BY_PRODUCT: Record<string, ProductCategory> = {
  clr1bougiesousbois0001: "Ambiance",
  clr2diffuseurclairier02: "Ambiance",
  clr3tiragebrumematin003: "Décoration murale",
  clr4plaidrefuge00000004: "Textile",
  clr5coussinmousse000005: "Textile",
};

export function getProductCategory(productId: string): ProductCategory | null {
  return CATEGORY_BY_PRODUCT[productId] ?? null;
}
