"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useCart } from "@/components/cart-context";
import { useFavorites } from "@/components/favorites-context";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { items } = useCart();
  const { favoriteIds } = useFavorites();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

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

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const transparent = isHome && !pastHero;
  const surfaceClasses = transparent
    ? "bg-transparent border-white/10"
    : "bg-white border-accent/30";
  const linkColorClasses = transparent
    ? "text-white hover:text-white/80"
    : "text-foreground hover:text-secondary";
  const linkTransitionClasses =
    "transition-colors duration-300 ease-out motion-reduce:transition-none";
  const iconColorClasses = transparent ? "text-white" : "text-foreground";

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) {
      return;
    }
    // Un Link vers l'URL déjà active ne relance pas de navigation (donc pas
    // de retour en haut) : on le fait nous-mêmes plutôt que de laisser le
    // clic sans effet quand le hero a défilé hors de vue.
    event.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior });
  }

  return (
    <header
      className={`sticky top-0 z-40 flex h-20 items-center border-b px-6 transition-colors duration-300 ease-out motion-reduce:transition-none ${surfaceClasses}`}
    >
      <div className="flex flex-1 items-center">
        <Link href="/" onClick={handleLogoClick}>
          <Image
            src={transparent ? "/RsoloWhite.svg" : "/Rsolo.svg"}
            alt="Rooted"
            width={42}
            height={40}
            className="h-10 w-auto sm:hidden"
          />
          <Image
            src={transparent ? "/rootedWhite2.svg" : "/rooted2.svg"}
            alt="Rooted"
            width={40}
            height={44}
            className="hidden h-12 w-auto sm:block"
          />
        </Link>
      </div>

      <nav className="hidden flex-1 items-center justify-center gap-8 sm:flex">
        <Link
          href="/"
          className={`text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Catalogue
        </Link>
        <Link
          href="/blog"
          className={`text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Blog
        </Link>
        <Link
          href="/contact"
          className={`text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Contact
        </Link>
        <Link
          href="/boutiques"
          className={`text-sm tracking-wide uppercase ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Boutiques
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Link
          href="/favoris"
          className={`hidden text-sm tracking-wide uppercase sm:inline ${linkTransitionClasses} ${linkColorClasses}`}
        >
          Favoris ({favoriteIds.length})
        </Link>

        <Link
          href="/panier"
          className={`hidden items-center gap-2 text-sm tracking-wide uppercase sm:flex ${linkTransitionClasses} ${linkColorClasses}`}
        >
          <span>Panier ({itemCount})</span>
          {itemCount > 0 ? (
            <span>{currencyFormatter.format(total)}</span>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className={`sm:hidden ${iconColorClasses}`}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-accent/30 bg-white px-6 py-4 sm:hidden"
      >
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Catalogue
        </Link>
        <Link
          href="/blog"
          onClick={() => setMenuOpen(false)}
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Blog
        </Link>
        <Link
          href="/contact"
          onClick={() => setMenuOpen(false)}
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Contact
        </Link>
        <Link
          href="/boutiques"
          onClick={() => setMenuOpen(false)}
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Boutiques
        </Link>
        <Link
          href="/favoris"
          onClick={() => setMenuOpen(false)}
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Favoris ({favoriteIds.length})
        </Link>
        <Link
          href="/panier"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          <span>Panier ({itemCount})</span>
          {itemCount > 0 ? <span>{currencyFormatter.format(total)}</span> : null}
        </Link>
      </div>
    </header>
  );
}
