import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <h1>Catalogue</h1>

      {products.length === 0 ? (
        <p>Aucun produit pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/produits/${product.id}`}>
                {/* Placeholder photo — emplacement de la vraie photo produit (mots-clés : {product.imageKeywords.join(", ")}) */}
                <div
                  className="aspect-square bg-gray-200"
                  role="img"
                  aria-label={`Photo à venir : ${product.imageKeywords.join(", ")}`}
                />
                <span>{product.price.toFixed(2)} €</span>
                <p>{product.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
