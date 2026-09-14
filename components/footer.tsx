import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-accent/30 bg-section px-6 py-8">
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
      <p className="mt-4 text-sm text-foreground/70">© Rooted — projet démo</p>
    </footer>
  );
}
