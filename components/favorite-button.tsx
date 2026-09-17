"use client";

import { useFavorites } from "@/components/favorites-context";

// Cœur écrit à la main (SVG, pas de bibliothèque ajoutée) : contour seul à
// l'état inactif, rempli à l'état favori.
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4.5c2 0 3.5 1.2 4.5 2.7C11 5.7 12.5 4.5 14.5 4.5 18 4.5 19.5 8 19.5 11.5 17 15.65 12 20 12 20Z" />
    </svg>
  );
}

export function FavoriteButton({ productId }: { productId: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-pressed={active}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-background/80 transition-colors ${
        active ? "text-secondary" : "text-foreground/60 hover:text-foreground"
      }`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
