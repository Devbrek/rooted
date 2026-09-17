"use client";

import { useState } from "react";
import { MAX_QUANTITY, useCart } from "@/components/cart-context";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const alreadyInCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const maxQuantity = MAX_QUANTITY - alreadyInCart;
  const atLimit = maxQuantity < 1;
  const [quantity, setQuantity] = useState(1);

  function decrement() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increment() {
    setQuantity((current) => Math.min(Math.max(maxQuantity, 1), current + 1));
  }

  function handleAdd() {
    if (atLimit) {
      return;
    }
    addItem(product, Math.min(quantity, Math.max(maxQuantity, 1)));
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-2">
      {alreadyInCart > 0 ? (
        <p className="font-sans text-sm text-foreground/70">
          Déjà {alreadyInCart} dans votre panier
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={atLimit || quantity <= 1}
          aria-label="Retirer une unité"
          className="border border-accent/30 px-3 py-1 text-foreground transition-colors hover:bg-section disabled:opacity-40"
        >
          −
        </button>
        <span className="font-sans text-foreground" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={atLimit || quantity >= maxQuantity}
          aria-label="Ajouter une unité"
          className="border border-accent/30 px-3 py-1 text-foreground transition-colors hover:bg-section disabled:opacity-40"
        >
          +
        </button>
      </div>

      {atLimit ? (
        <p className="font-sans text-sm text-secondary">10 maximum par produit</p>
      ) : null}

      <button
        type="button"
        onClick={handleAdd}
        disabled={atLimit}
        className="bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
