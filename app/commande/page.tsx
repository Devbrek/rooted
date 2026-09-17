"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { ThinBanner } from "@/components/thin-banner";
import { getProductImage } from "@/lib/product-images";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
  nom?: string;
  email?: string;
  adresse?: string;
};

export default function CheckoutPage() {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Le bouton "Payer" n'est pas un submit du formulaire (il déclenche l'appel
  // Stripe séparément) : la validation "required" native ne se déclenche
  // jamais toute seule, d'où cette vérification manuelle avant tout appel.
  function validateFields(): FieldErrors {
    const form = formRef.current;
    if (!form) {
      return {};
    }
    const data = new FormData(form);
    const nom = String(data.get("nom") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const adresse = String(data.get("adresse") ?? "").trim();

    const errors: FieldErrors = {};
    if (!nom) {
      errors.nom = "Le nom est obligatoire.";
    }
    if (!email) {
      errors.email = "L'email est obligatoire.";
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.email = "Le format de l'email n'est pas valide.";
    }
    if (!adresse) {
      errors.adresse = "L'adresse est obligatoire.";
    }
    return errors;
  }

  async function handlePayer() {
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

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
      <ThinBanner title="Finaliser la commande" />

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="font-sans text-foreground">Votre panier est vide.</p>
          <Link
            href="/"
            className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
          >
            Retour au catalogue
          </Link>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16">
          {/*
            Champs non exploités pour l'instant : aucune commande n'est stockée en base
            (hors périmètre chantier E). Conservés tels quels selon le WIREFRAME.
          */}
          <form
            ref={formRef}
            onSubmit={(event) => event.preventDefault()}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="nom" className="flex flex-col gap-1 font-sans text-sm text-foreground">
                Nom
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(fieldErrors.nom)}
                  aria-describedby={fieldErrors.nom ? "nom-error" : undefined}
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {fieldErrors.nom ? (
                <p id="nom-error" className="font-sans text-sm text-secondary">
                  {fieldErrors.nom}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="flex flex-col gap-1 font-sans text-sm text-foreground">
                Email
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {fieldErrors.email ? (
                <p id="email-error" className="font-sans text-sm text-secondary">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="adresse" className="flex flex-col gap-1 font-sans text-sm text-foreground">
                Adresse
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  autoComplete="street-address"
                  required
                  aria-invalid={Boolean(fieldErrors.adresse)}
                  aria-describedby={fieldErrors.adresse ? "adresse-error" : undefined}
                  className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                />
              </label>
              {fieldErrors.adresse ? (
                <p id="adresse-error" className="font-sans text-sm text-secondary">
                  {fieldErrors.adresse}
                </p>
              ) : null}
            </div>
          </form>

          <section aria-label="Récapitulatif de commande" className="bg-section px-6 py-8">
            <ul className="flex flex-col gap-4">
              {items.map((item) => {
                const image = getProductImage(item.productId);

                return (
                  <li key={item.productId} className="flex items-center gap-4">
                    <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-background">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={`Photo à venir : ${item.name}`}
                          className="h-full w-full bg-background"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="font-serif text-foreground">{item.name}</span>
                      <span className="font-sans text-sm text-foreground/70">
                        Quantité : {item.quantity}
                      </span>
                    </div>
                    <span className="font-serif text-foreground">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 border-t border-accent/30 pt-4 text-right font-serif text-xl text-foreground">
              Total : {total.toFixed(2)} €
            </p>
          </section>

          {error && (
            <p role="alert" className="font-sans text-sm text-secondary">
              {error}
            </p>
          )}

          <div className="border border-accent/30 bg-section px-4 py-3">
            <p className="font-sans text-sm text-foreground/80">
              Paiement en mode test : utilisez la carte 4242 4242 4242 4242,
              une date d&apos;expiration future et n&apos;importe quel code à
              3 chiffres. Saisissez uniquement des informations fictives.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePayer}
            disabled={isSubmitting}
            className="self-start bg-accent px-8 py-3 text-sm tracking-wide text-foreground uppercase transition-colors hover:bg-secondary hover:text-background disabled:opacity-60"
          >
            {isSubmitting ? "Redirection vers Stripe…" : "Payer"}
          </button>
        </div>
      )}
    </main>
  );
}
