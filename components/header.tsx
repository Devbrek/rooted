"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

export function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image src="/rooted.png" alt="Rooted" width={40} height={44} />
        </Link>
        <Link href="/">Catalogue</Link>
      </div>
      <Link href="/panier">Panier ({itemCount})</Link>
    </header>
  );
}
