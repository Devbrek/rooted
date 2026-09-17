import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductMaterialCare } from "@/components/product-material-care";
import { ProductReviews } from "@/components/product-reviews";
import { SimilarProducts } from "@/components/similar-products";
import { getProductImage } from "@/lib/product-images";
import { getProductCare } from "@/lib/product-care";

export default async function ProductPage({ params }: PageProps<"/produits/[id]">) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  const image = getProductImage(product.id);
  const care = getProductCare(product.id);

  const similarProducts = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 3,
  });

  return (
    <main>
      <section className="bg-background px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 sm:items-center">
          {/* Une seule photo grand format, d'ambiance — pas un packshot. */}
          <div className="relative aspect-product overflow-hidden bg-section">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div
                role="img"
                aria-label={`Photo à venir : ${product.imageKeywords.join(", ")}`}
                className="h-full w-full bg-section"
              />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} />
            </div>
            <span className="font-serif text-xl text-secondary">
              {product.price.toFixed(2)} €
            </span>
            <p className="font-sans text-foreground">{product.description}</p>
            <div>
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {care ? <ProductMaterialCare care={care} /> : null}

      <ProductReviews productId={product.id} />

      <SimilarProducts products={similarProducts} />
    </main>
  );
}
