"use client";

import Image from "next/image";
import Link from "next/link";
import { MAX_QUANTITY, useCart } from "@/components/cart-context";
import { ThinBanner } from "@/components/thin-banner";
import { getProductImage } from "@/lib/product-images";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleQuantityChange(productId: string, rawValue: string) {
    const value = Number(rawValue);
    if (Number.isInteger(value)) {
      setQuantity(productId, value);
    }
  }

  return (
    <main>
      <ThinBanner title="Votre panier" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="font-sans text-foreground">Votre panier est vide.</p>
          <Link
            href="/"
            className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
          >
            Retour au catalogue
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <ul className="flex flex-col gap-6">
            {items.map((item) => {
              const image = getProductImage(item.productId);

              return (
                <li
                  key={item.productId}
                  className="flex flex-col gap-4 border-b border-accent/30 pb-6 sm:flex-row sm:flex-wrap sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative aspect-square w-20 shrink-0 overflow-hidden bg-section">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={`Photo à venir : ${item.name}`}
                          className="h-full w-full bg-section"
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="font-serif text-lg text-foreground">
                        {item.name}
                      </p>
                      <span className="font-sans text-sm text-secondary">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end">
                    <label
                      htmlFor={`quantite-${item.productId}`}
                      className="flex flex-col items-center gap-1 text-xs tracking-wide text-foreground/70 uppercase"
                    >
                      Quantité
                      <input
                        id={`quantite-${item.productId}`}
                        type="number"
                        min={1}
                        max={MAX_QUANTITY}
                        value={item.quantity}
                        onChange={(event) =>
                          handleQuantityChange(item.productId, event.target.value)
                        }
                        className="w-16 border border-accent/40 bg-background px-2 py-1 text-center font-sans text-foreground"
                      />
                    </label>

                    <span className="w-20 text-right font-serif text-foreground">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-xs tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
                    >
                      Supprimer
                    </button>
                  </div>

                  {item.quantity === MAX_QUANTITY && (
                    <p className="w-full text-xs text-secondary">
                      10 maximum par produit
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col items-end gap-1 bg-section px-6 py-6">
            <p className="font-sans text-foreground">
              Sous-total : {total.toFixed(2)} €
            </p>
            <p className="font-serif text-xl text-foreground">
              Total : {total.toFixed(2)} €
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/commande"
              className="bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background"
            >
              Passer commande
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
