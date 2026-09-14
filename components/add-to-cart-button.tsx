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
    <button type="button" onClick={() => addItem(product)}>
      Ajouter au panier
    </button>
  );
}
