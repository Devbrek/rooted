// Avis clients fictifs (chantier P), associés aux 5 produits réels en base
// (même principe que lib/product-images.ts). Prénom inventé seul, aucune
// allégation technique, santé ou commerciale, aucune personne identifiable.
export type Review = {
  author: string;
  rating: number;
  text: string;
};

const REVIEWS: Record<string, Review[]> = {
  clr1bougiesousbois0001: [
    {
      author: "Claire",
      rating: 5,
      text: "Une odeur discrète mais présente, parfaite pour les soirées d'automne.",
    },
    {
      author: "Julien",
      rating: 4,
      text: "Le pot en verre est très joli sur une étagère, même une fois la bougie terminée.",
    },
    {
      author: "Manon",
      rating: 5,
      text: "Exactement l'ambiance forêt qu'on nous promettait.",
    },
  ],
  clr2diffuseurclairier02: [
    {
      author: "Thomas",
      rating: 5,
      text: "Discret dans le salon, s'intègre bien avec le reste de la déco.",
    },
    {
      author: "Léa",
      rating: 4,
      text: "Le bois clair est vraiment esthétique, facile à assortir avec les meubles.",
    },
  ],
  clr3tiragebrumematin003: [
    {
      author: "Nicolas",
      rating: 5,
      text: "Le rendu du tirage est doux, parfait pour une chambre.",
    },
    {
      author: "Camille",
      rating: 4,
      text: "Simple à encadrer, le format standard aide beaucoup.",
    },
    {
      author: "Inès",
      rating: 5,
      text: "Une image apaisante, on ne s'en lasse pas.",
    },
  ],
  clr4plaidrefuge00000004: [
    {
      author: "Hugo",
      rating: 5,
      text: "Très épais, parfait pour les soirées canapé.",
    },
    {
      author: "Sophie",
      rating: 4,
      text: "Le coloris beige et vert sauge se marie bien avec notre déco.",
    },
  ],
  clr5coussinmousse000005: [
    {
      author: "Antoine",
      rating: 4,
      text: "Texture agréable, un peu plus petit que ce que j'imaginais.",
    },
    {
      author: "Elise",
      rating: 5,
      text: "La couleur vert sauge est fidèle aux photos.",
    },
    {
      author: "Paul",
      rating: 4,
      text: "Un joli coussin d'appoint, discret sur le canapé.",
    },
  ],
};

// Sélection fixe pour la section d'accueil : un avis par produit différent,
// pour varier les objets mentionnés plutôt que de prendre les 3 premiers.
const HOMEPAGE_REVIEWS: Review[] = [
  REVIEWS.clr1bougiesousbois0001[0],
  REVIEWS.clr4plaidrefuge00000004[0],
  REVIEWS.clr3tiragebrumematin003[2],
];

export function getProductReviews(productId: string): Review[] {
  return REVIEWS[productId] ?? [];
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) {
    return 0;
  }
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.length;
}

export function getHomepageReviews(): Review[] {
  return HOMEPAGE_REVIEWS;
}
