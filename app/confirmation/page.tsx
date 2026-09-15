import type Stripe from "stripe";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

// Relit la session Stripe côté serveur et ne la considère confirmée que si
// Stripe atteste explicitement que le paiement est réglé. Le session_id de
// l'URL n'est qu'un pointeur : il ne prouve rien par lui-même (manipulable
// par le client), d'où cette vérification.
//
// Distingue « commande introuvable » (déclenche not-found.tsx, HTTP 404) de
// « panne technique » (lance une Error, capturée par error.tsx) : seule une
// session absente, un identifiant inconnu de Stripe (resource_missing) ou un
// paiement non abouti relève du premier cas ; toute autre erreur Stripe
// (ex. authentification) relève du second.
async function getPaidSession(
  sessionId: string | string[] | undefined
): Promise<Stripe.Checkout.Session> {
  if (typeof sessionId !== "string" || sessionId.length === 0) {
    notFound();
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch (error) {
    // Ne jamais logger l'objet d'erreur complet ni son message : seulement
    // le type et le code.
    const stripeError = error as { type?: string; code?: string };
    console.error("Échec de lecture de la session Stripe", {
      type: stripeError?.type ?? "unknown",
      code: stripeError?.code ?? "unknown",
    });
    if (stripeError?.code === "resource_missing") {
      notFound();
    }
    throw new Error("Impossible de vérifier la commande.");
  }

  if (session.payment_status !== "paid") {
    notFound();
  }

  return session;
}

export default async function ConfirmationPage({
  searchParams,
}: PageProps<"/confirmation">) {
  const { session_id: sessionId } = await searchParams;
  const session = await getPaidSession(sessionId);

  const lineItems = session.line_items?.data ?? [];
  const total = (session.amount_total ?? 0) / 100;

  return (
    <main>
      <ClearCartOnMount />

      {/* Photo pleine largeur, apaisante — pas d'effet "célébration". */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src="/confirmation.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Merci, votre commande est confirmée
        </h1>
        <p className="font-sans text-sm text-foreground/70">
          Numéro de commande : {session.id}
        </p>

        <section
          aria-label="Articles commandés"
          className="w-full bg-section px-6 py-8 text-left"
        >
          <ul className="flex flex-col gap-4">
            {lineItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-serif text-foreground">
                    {item.description}
                  </span>
                  <span className="font-sans text-sm text-foreground/70">
                    Quantité : {item.quantity}
                  </span>
                </div>
                <span className="font-serif text-foreground">
                  {((item.amount_total ?? 0) / 100).toFixed(2)} €
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-accent/30 pt-4 text-right font-serif text-xl text-foreground">
            Total : {total.toFixed(2)} €
          </p>
        </section>

        <p className="font-sans text-xs text-foreground/60">
          Projet démo, paiement en mode test.
        </p>

        <Link
          href="/"
          className="text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
        >
          Retour au catalogue
        </Link>
      </div>
    </main>
  );
}
