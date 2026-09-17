"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function HeaderNav({ itemCount, total }: { itemCount: number; total: number }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/rooted.png"
            alt="Rooted"
            width={40}
            height={44}
            className="h-12 w-auto"
          />
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
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) {
      return;
    }
    const hero = document.getElementById("hero");
    if (!hero) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  if (isHome) {
    const fixedBarStateClasses = pastHero
      ? "translate-y-0 opacity-100"
      : "pointer-events-none -translate-y-full opacity-0";

    return (
      <>
        <header className="flex items-center justify-between border-b border-accent/30 bg-background px-6 py-4">
          <HeaderNav itemCount={itemCount} total={total} />
        </header>
        <div
          aria-hidden={pastHero ? undefined : true}
          inert={pastHero ? undefined : true}
          className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-accent/30 bg-background px-6 py-4 transition-all duration-300 ease-out motion-reduce:transition-none ${fixedBarStateClasses}`}
        >
          <HeaderNav itemCount={itemCount} total={total} />
        </div>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-accent/30 bg-background px-6 py-4">
      <HeaderNav itemCount={itemCount} total={total} />
    </header>
  );
}
