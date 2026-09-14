import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

  const lineItems = items.map((item) => {
    // Le prix est relu depuis la base de données, jamais accepté depuis le client.
    const product = products.find((p) => p.id === item.productId)!;
    return {
      price_data: {
        currency: "eur",
        product_data: { name: product.name },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/commande`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: session.url });
}
