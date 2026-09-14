"use client";

import { useCart } from "@/components/cart-context";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background"
    >
      Ajouter au panier
    </button>
  );
}
