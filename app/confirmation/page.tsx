import type Stripe from "stripe";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

// Relit la session Stripe côté serveur et ne la considère confirmée que si
// Stripe atteste explicitement que le paiement est réglé. Le session_id de
// l'URL n'est qu'un pointeur : il ne prouve rien par lui-même (manipulable
// par le client), d'où cette vérification.
async function getPaidSession(
  sessionId: string | string[] | undefined
): Promise<Stripe.Checkout.Session | null> {
  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return null;
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    // Identifiant inconnu de Stripe ou mal formé.
    return null;
  }

  if (session.payment_status !== "paid") {
    return null;
  }

  return session;
}

export default async function ConfirmationPage({
  searchParams,
}: PageProps<"/confirmation">) {
  const { session_id: sessionId } = await searchParams;
  const session = await getPaidSession(sessionId);

  if (!session) {
    return (
      <main>
        <h1>Commande introuvable</h1>
        <p>
          Impossible de confirmer cette commande : le paiement n&rsquo;a pas
          pu être vérifié auprès de Stripe (session absente, invalide, ou
          paiement non abouti).
        </p>
        <Link href="/panier">Retour au panier</Link>
      </main>
    );
  }

  const lineItems = session.line_items?.data ?? [];
  const total = (session.amount_total ?? 0) / 100;

  return (
    <main>
      <ClearCartOnMount />

      {/* Placeholder photo — pleine largeur, apaisante (à venir) */}
      <div
        className="h-48 bg-gray-200"
        role="img"
        aria-label="Photo à venir : ambiance apaisante"
      />

      <h1>Merci, votre commande est confirmée</h1>
      <p>Numéro de commande : {session.id}</p>

      <section aria-label="Articles commandés">
        <ul>
          {lineItems.map((item) => (
            <li key={item.id}>
              <span>{item.description}</span>
              <span>Quantité : {item.quantity}</span>
              <span>{((item.amount_total ?? 0) / 100).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
        <p>Total : {total.toFixed(2)} €</p>
      </section>

      <p>Projet démo, paiement en mode test.</p>

      <Link href="/">Retour au catalogue</Link>
    </main>
  );
}
