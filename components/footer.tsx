import Link from "next/link";
import { SocialIcons } from "@/components/social-icons";

export function Footer() {
  return (
    <footer className="flex flex-col items-center border-t border-accent/30 bg-section px-6 py-8 text-center">
      <nav className="flex gap-4">
        <Link
          href="/"
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Catalogue
        </Link>
        <Link
          href="/panier"
          className="text-sm tracking-wide text-foreground uppercase transition-colors hover:text-secondary"
        >
          Panier
        </Link>
      </nav>

      <nav className="mt-4 flex gap-4">
        <Link
          href="/mentions-legales"
          className="text-xs tracking-wide text-foreground/70 uppercase transition-colors hover:text-secondary"
        >
          Mentions légales
        </Link>
        <Link
          href="/confidentialite"
          className="text-xs tracking-wide text-foreground/70 uppercase transition-colors hover:text-secondary"
        >
          Confidentialité
        </Link>
        <Link
          href="/cgv"
          className="text-xs tracking-wide text-foreground/70 uppercase transition-colors hover:text-secondary"
        >
          CGV
        </Link>
      </nav>

      <div className="mt-6">
        <SocialIcons />
      </div>

      <p className="mt-4 text-sm text-foreground/70">© Rooted — projet démo</p>
      <p className="mt-1 text-xs text-foreground/60">
        Projet démo — produits fictifs.
      </p>
    </footer>
  );
}
