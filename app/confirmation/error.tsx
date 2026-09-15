"use client";

import Link from "next/link";

export default function ConfirmationError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Reçu par convention Next.js, jamais affiché (ni message, ni digest) : on
  // ne montre qu'un message générique, quelle que soit l'erreur réelle.
  void error;

  return (
    <main>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">
          Impossible de vérifier votre commande pour le moment.
        </h1>
        <p className="font-sans text-foreground">
          Une erreur technique empêche de vérifier votre paiement auprès de
          Stripe pour le moment. Réessayez dans quelques instants.
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
