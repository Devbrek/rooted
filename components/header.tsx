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

function HeaderNav({
  itemCount,
  total,
  transparent,
}: {
  itemCount: number;
  total: number;
  transparent: boolean;
}) {
  const linkColorClasses = transparent
    ? "text-white hover:text-white/80"
    : "text-foreground hover:text-secondary";
  const linkTransitionClasses =
    "transition-colors duration-300 ease-out motion-reduce:transition-none";

  return (
    <>
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src={transparent ? "/rootedWhite2.svg" : "/rooted2.svg"}
            alt="Rooted"
            width={40}
            height={44}
            className="h-12 w-auto"
          />
        </Link>
        <Link
          href="/"
          className={`text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Catalogue
        </Link>
      </div>
      <Link
        href="/panier"
        className={`flex items-center gap-2 text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
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
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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

  const transparent = isHome && !pastHero;
  const surfaceClasses = transparent
    ? "bg-transparent border-white/10"
    : "bg-white border-accent/30";

  return (
    <header
      className={`sticky top-0 z-40 flex h-20 items-center justify-between border-b px-6 transition-colors duration-300 ease-out motion-reduce:transition-none ${surfaceClasses}`}
    >
      <HeaderNav
        itemCount={itemCount}
        total={total}
        transparent={transparent}
      />
    </header>
  );
}
