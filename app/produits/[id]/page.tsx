import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({ params }: PageProps<"/produits/[id]">) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return (
    <main>
      {/* Placeholder photo — emplacement de la vraie photo produit (mots-clés : {product.imageKeywords.join(", ")}) */}
      <div
        className="aspect-square bg-gray-200"
        role="img"
        aria-label={`Photo à venir : ${product.imageKeywords.join(", ")}`}
      />
      <h1>{product.name}</h1>
      <span>{product.price.toFixed(2)} €</span>
      <p>{product.description}</p>
      <button type="button">Ajouter au panier</button>
    </main>
  );
}
