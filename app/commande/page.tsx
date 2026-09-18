"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { ThinBanner } from "@/components/thin-banner";
import { getProductImage } from "@/lib/product-images";
import { checkoutFormSchema, formatCheckoutFieldErrors } from "@/lib/checkout-form-schema";

type FieldErrors = Record<string, string>;

function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  maxLength,
  error,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
  error?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex flex-col gap-1 font-sans text-sm text-foreground">
        {label}
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
        />
      </label>
      {hint && !error ? (
        <p id={`${id}-hint`} className="font-sans text-xs text-foreground/60">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="font-sans text-sm text-secondary">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [facturationIdentique, setFacturationIdentique] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function readForm() {
    const form = formRef.current;
    const data = new FormData(form ?? undefined);
    const get = (name: string) => String(data.get(name) ?? "");

    const raw: Record<string, unknown> = {
      facturationIdentique,
      prenom: get("prenom"),
      nom: get("nom"),
      email: get("email"),
      societe: get("societe"),
      telephone: get("telephone"),
      adresse: get("adresse"),
      complement: get("complement"),
      codePostal: get("codePostal"),
      ville: get("ville"),
      instructions: get("instructions"),
    };

    if (!facturationIdentique) {
      raw.facturationPrenom = get("facturationPrenom");
      raw.facturationNom = get("facturationNom");
      raw.facturationAdresse = get("facturationAdresse");
      raw.facturationComplement = get("facturationComplement");
      raw.facturationCodePostal = get("facturationCodePostal");
      raw.facturationVille = get("facturationVille");
    }

    return raw;
  }

  async function handlePayer() {
    const result = checkoutFormSchema.safeParse(readForm());

    if (!result.success) {
      setFieldErrors(formatCheckoutFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
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
          checkout: result.data,
        }),
      });

      const data = await response.json();

      if (!response.ok || typeof data.url !== "string") {
        if (data.fields) {
          setFieldErrors(data.fields);
        }
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
          <div className="border border-accent/30 bg-section px-4 py-3">
            <p className="font-sans text-sm text-foreground/80">
              Projet démo : saisissez des informations fictives, rien n&apos;est
              conservé.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={(event) => event.preventDefault()}
            noValidate
            className="flex flex-col gap-8"
          >
            <fieldset className="flex flex-col gap-4">
              <legend className="font-serif text-lg text-foreground">
                Livraison
              </legend>

              <FormField
                id="prenom"
                label="Prénom"
                autoComplete="given-name"
                required
                maxLength={50}
                error={fieldErrors.prenom}
              />
              <FormField
                id="nom"
                label="Nom"
                autoComplete="family-name"
                required
                maxLength={50}
                error={fieldErrors.nom}
              />
              <FormField
                id="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                error={fieldErrors.email}
              />
              <FormField
                id="societe"
                label="Société (facultatif)"
                autoComplete="organization"
                maxLength={100}
                error={fieldErrors.societe}
              />
              <FormField
                id="telephone"
                label="Téléphone (facultatif)"
                type="tel"
                autoComplete="tel"
                error={fieldErrors.telephone}
                hint="Utilisé par le transporteur en cas d'absence."
              />
              <FormField
                id="adresse"
                label="Adresse"
                autoComplete="street-address"
                required
                maxLength={100}
                error={fieldErrors.adresse}
              />
              <FormField
                id="complement"
                label="Complément d'adresse (facultatif)"
                autoComplete="address-line2"
                maxLength={100}
                error={fieldErrors.complement}
              />
              <FormField
                id="codePostal"
                label="Code postal"
                autoComplete="postal-code"
                required
                maxLength={5}
                error={fieldErrors.codePostal}
              />
              <FormField
                id="ville"
                label="Ville"
                autoComplete="address-level2"
                required
                maxLength={50}
                error={fieldErrors.ville}
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="pays" className="flex flex-col gap-1 font-sans text-sm text-foreground">
                  Pays
                  <input
                    id="pays"
                    type="text"
                    value="France"
                    disabled
                    className="border border-accent/40 bg-section px-3 py-2 font-sans text-foreground/70"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="instructions"
                  className="flex flex-col gap-1 font-sans text-sm text-foreground"
                >
                  Instructions de livraison (facultatif)
                  <textarea
                    id="instructions"
                    name="instructions"
                    maxLength={200}
                    rows={3}
                    aria-invalid={Boolean(fieldErrors.instructions)}
                    aria-describedby={
                      fieldErrors.instructions ? "instructions-error" : undefined
                    }
                    className="border border-accent/40 bg-background px-3 py-2 font-sans text-foreground"
                  />
                </label>
                {fieldErrors.instructions ? (
                  <p id="instructions-error" className="font-sans text-sm text-secondary">
                    {fieldErrors.instructions}
                  </p>
                ) : null}
              </div>
            </fieldset>

            <label className="flex items-center gap-2 font-sans text-sm text-foreground">
              <input
                type="checkbox"
                checked={facturationIdentique}
                onChange={(event) => setFacturationIdentique(event.target.checked)}
              />
              Adresse de facturation identique à la livraison
            </label>

            {!facturationIdentique ? (
              <fieldset className="flex flex-col gap-4">
                <legend className="font-serif text-lg text-foreground">
                  Facturation
                </legend>

                <FormField
                  id="facturationPrenom"
                  label="Prénom"
                  autoComplete="given-name"
                  required
                  maxLength={50}
                  error={fieldErrors.facturationPrenom}
                />
                <FormField
                  id="facturationNom"
                  label="Nom"
                  autoComplete="family-name"
                  required
                  maxLength={50}
                  error={fieldErrors.facturationNom}
                />
                <FormField
                  id="facturationAdresse"
                  label="Adresse"
                  autoComplete="street-address"
                  required
                  maxLength={100}
                  error={fieldErrors.facturationAdresse}
                />
                <FormField
                  id="facturationComplement"
                  label="Complément d'adresse (facultatif)"
                  autoComplete="address-line2"
                  maxLength={100}
                  error={fieldErrors.facturationComplement}
                />
                <FormField
                  id="facturationCodePostal"
                  label="Code postal"
                  autoComplete="postal-code"
                  required
                  maxLength={5}
                  error={fieldErrors.facturationCodePostal}
                />
                <FormField
                  id="facturationVille"
                  label="Ville"
                  autoComplete="address-level2"
                  required
                  maxLength={50}
                  error={fieldErrors.facturationVille}
                />

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="pays-facturation"
                    className="flex flex-col gap-1 font-sans text-sm text-foreground"
                  >
                    Pays
                    <input
                      id="pays-facturation"
                      type="text"
                      value="France"
                      disabled
                      className="border border-accent/40 bg-section px-3 py-2 font-sans text-foreground/70"
                    />
                  </label>
                </div>
              </fieldset>
            ) : null}
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
