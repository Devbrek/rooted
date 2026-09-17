"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <header className="flex items-center justify-between border-b border-accent/30 bg-background px-6 py-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image src="/rooted.png" alt="Rooted" width={40} height={44} />
        </Link>
        <Link
          href="/"
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Catalogue
        </Link>
      </div>
      <Link
        href="/panier"
        className="flex items-center gap-2 text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
      >
        <span>Panier ({itemCount})</span>
        {itemCount > 0 ? <span>{currencyFormatter.format(total)}</span> : null}
      </Link>
    </header>
  );
}
