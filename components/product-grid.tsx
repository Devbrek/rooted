"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import {
  getProductCategory,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/lib/product-categories";

type Product = {
  id: string;
  name: string;
  price: number;
  imageKeywords: string[];
};

const ALL_FILTER = "Tout";
type CategoryFilter = typeof ALL_FILTER | ProductCategory;

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 text-sm tracking-wide uppercase transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "border border-accent/40 text-foreground/70 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<CategoryFilter>(ALL_FILTER);

  const filteredProducts =
    filter === ALL_FILTER
      ? products
      : products.filter(
          (product) => getProductCategory(product.id) === filter,
        );

  return (
    <section
      id="catalogue"
      className="scroll-mt-20 bg-background px-6 py-20"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Catalogue" />

        {products.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <FilterButton
              active={filter === ALL_FILTER}
              onClick={() => setFilter(ALL_FILTER)}
            >
              {ALL_FILTER}
            </FilterButton>
            {PRODUCT_CATEGORIES.map((category) => (
              <FilterButton
                key={category}
                active={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </FilterButton>
            ))}
          </div>
        ) : null}

        {products.length === 0 ? (
          <p className="mt-12 text-center font-sans text-foreground">
            Aucun produit pour le moment.
          </p>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="font-sans text-foreground">
              Aucun produit dans cette catégorie.
            </p>
            <button
              type="button"
              onClick={() => setFilter(ALL_FILTER)}
              className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
            >
              Voir tout
            </button>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
