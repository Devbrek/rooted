import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const MAX_QUANTITY_PER_PRODUCT = 10;

type CheckoutRequestItem = {
  productId: string;
  quantity: number;
};

function isValidRequestBody(
  body: unknown
): body is { items: CheckoutRequestItem[] } {
  if (typeof body !== "object" || body === null || !("items" in body)) {
    return false;
  }
  const { items } = body as { items: unknown };
  if (!Array.isArray(items) || items.length === 0) {
    return false;
  }
  return items.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as CheckoutRequestItem).productId === "string" &&
      typeof (item as CheckoutRequestItem).quantity === "number" &&
      Number.isInteger((item as CheckoutRequestItem).quantity) &&
      (item as CheckoutRequestItem).quantity > 0
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!isValidRequestBody(body)) {
    return NextResponse.json(
      { error: "Panier invalide." },
      { status: 400 }
    );
  }

  const { items } = body;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
  });

  if (products.length !== new Set(items.map((item) => item.productId)).size) {
    return NextResponse.json(
      { error: "Un ou plusieurs produits du panier sont introuvables." },
      { status: 400 }
    );
  }

  // Fusionne les lignes de même productId : une seule ligne Stripe par produit,
  // quantités cumulées, pour pouvoir plafonner le total par produit.
  const mergedQuantities = new Map<string, number>();
  for (const item of items) {
    mergedQuantities.set(
      item.productId,
      (mergedQuantities.get(item.productId) ?? 0) + item.quantity
    );
  }

  for (const quantity of mergedQuantities.values()) {
    if (quantity > MAX_QUANTITY_PER_PRODUCT) {
      return NextResponse.json(
        {
          error: `Quantité maximale dépassée (${MAX_QUANTITY_PER_PRODUCT} par produit).`,
        },
        { status: 400 }
      );
    }
  }

  const lineItems = Array.from(mergedQuantities.entries()).map(
    ([productId, quantity]) => {
      // Le prix est relu depuis la base de données, jamais accepté depuis le client.
      const product = products.find((p) => p.id === productId)!;
      return {
        price_data: {
          currency: "eur",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      };
    }
  );

  const origin = request.nextUrl.origin;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/commande`,
    });
  } catch (error) {
    // Ne jamais logger l'objet d'erreur complet ni son message : seulement
    // le type et le code, pour éviter toute fuite (ex. détails de requête Stripe).
    const stripeError = error as { type?: string; code?: string };
    console.error("Échec de création de la session Stripe", {
      type: stripeError?.type ?? "unknown",
      code: stripeError?.code ?? "unknown",
    });
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible." },
      { status: 500 }
    );
  }

  if (!session.url) {
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: session.url });
}
