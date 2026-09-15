import Link from "next/link";

export default function ConfirmationNotFound() {
  return (
    <main>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">
          Commande introuvable
        </h1>
        <p className="font-sans text-foreground">
          Impossible de confirmer cette commande : le paiement n&rsquo;a pas
          pu être vérifié auprès de Stripe (session absente, invalide, ou
          paiement non abouti).
        </p>
        <Link
          href="/panier"
          className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
        >
          Retour au panier
        </Link>
      </div>
    </main>
  );
}
