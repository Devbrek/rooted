"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";

export function CartToast() {
  const { lastAdded } = useCart();
  const [hiddenKey, setHiddenKey] = useState<number | null>(null);

  useEffect(() => {
    if (!lastAdded) {
      return;
    }
    const key = lastAdded.key;
    const timer = setTimeout(() => setHiddenKey(key), 7000);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  const showContent = lastAdded !== null && lastAdded.key !== hiddenKey;

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end"
    >
      {showContent ? (
        <div className="flex w-full items-center justify-between gap-4 bg-foreground px-6 py-4 text-background sm:w-auto sm:max-w-sm">
          <p className="font-sans text-sm">
            {lastAdded.quantity} × {lastAdded.name} ajouté au panier
          </p>
          <Link
            href="/panier"
            className="text-sm tracking-wide uppercase underline underline-offset-4 hover:text-accent"
          >
            Voir le panier
          </Link>
        </div>
      ) : null}
    </div>
  );
}
