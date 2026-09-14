"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-context";

export default function CheckoutPage() {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handlePayer() {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || typeof data.url !== "string") {
        setError(data.error ?? "Impossible de démarrer le paiement.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Impossible de démarrer le paiement.");
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <div className="relative">
        {/* Placeholder photo — bandeau brume/forêt (à venir), même gabarit que /panier */}
        <div
          className="h-32 bg-gray-200"
          role="img"
          aria-label="Photo à venir : bandeau brume/forêt"
        />
        <h1>Finaliser la commande</h1>
      </div>

      {items.length === 0 ? (
        <div>
          <p>Votre panier est vide.</p>
          <Link href="/">Retour au catalogue</Link>
        </div>
      ) : (
        <>
          {/*
            Champs non exploités pour l'instant : aucune commande n'est stockée en base
            (hors périmètre chantier E). Conservés tels quels selon le WIREFRAME.
          */}
          <form onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="nom">
              Nom
              <input id="nom" name="nom" type="text" autoComplete="name" />
            </label>
            <label htmlFor="email">
              Email
              <input id="email" name="email" type="email" autoComplete="email" />
            </label>
            <label htmlFor="adresse">
              Adresse
              <input id="adresse" name="adresse" type="text" autoComplete="street-address" />
            </label>
          </form>

          <section aria-label="Récapitulatif de commande">
            <ul>
              {items.map((item) => (
                <li key={item.productId}>
                  <span>{item.name}</span>
                  <span>Quantité : {item.quantity}</span>
                  <span>{item.price.toFixed(2)} €</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
            <p>Total : {total.toFixed(2)} €</p>
          </section>

          {error && <p role="alert">{error}</p>}

          <button type="button" onClick={handlePayer} disabled={isSubmitting}>
            {isSubmitting ? "Redirection vers Stripe…" : "Payer"}
          </button>
        </>
      )}
    </main>
  );
}
