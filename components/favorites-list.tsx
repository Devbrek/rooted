"use client";

import Link from "next/link";
import { useFavorites } from "@/components/favorites-context";
import { ProductCard } from "@/components/product-card";

type Product = {
  id: string;
  name: string;
  price: number;
  imageKeywords: string[];
};

export function FavoritesList({ products }: { products: Product[] }) {
  const { favoriteIds } = useFavorites();
  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <p className="font-sans text-foreground">
          Vous n&apos;avez pas encore de favoris.
        </p>
        <Link
          href="/"
          className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 px-6 py-16 sm:grid-cols-3">
      {favoriteProducts.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
