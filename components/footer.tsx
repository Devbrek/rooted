import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <nav className="flex gap-4">
        <Link href="/">Catalogue</Link>
        <Link href="/panier">Panier</Link>
      </nav>
      <p>© Rooted — projet démo</p>
    </footer>
  );
}
