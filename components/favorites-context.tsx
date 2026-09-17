"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "rooted-favorites-v1";

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function isValidProductId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function readStoredFavorites(knownProductIds: Set<string>): string[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of parsed) {
    if (!isValidProductId(entry) || seen.has(entry) || !knownProductIds.has(entry)) {
      continue;
    }
    seen.add(entry);
    result.push(entry);
  }
  return result;
}

function writeStoredFavorites(favoriteIds: string[]) {
  try {
    if (favoriteIds.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  } catch {
    // Stockage indisponible (navigation privée, quota) : les favoris restent en mémoire pour la session.
  }
}

export function FavoritesProvider({
  children,
  productIds,
}: {
  children: ReactNode;
  productIds: string[];
}) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const knownProductIds = new Set(productIds);
    const restored = readStoredFavorites(knownProductIds);
    /* eslint-disable react-hooks/set-state-in-effect -- lecture de localStorage au montage, synchronisation avec un système externe */
    setFavoriteIds(restored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Ne doit s'exécuter qu'une fois, à l'hydratation initiale du stockage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStoredFavorites(favoriteIds);
  }, [favoriteIds, hydrated]);

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId);
  }

  function toggleFavorite(productId: string) {
    setFavoriteIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
