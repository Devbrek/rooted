import Image from "next/image";
import Link from "next/link";
import { getProductImage } from "@/lib/product-images";
import { SectionHeading } from "@/components/section-heading";

type Product = {
  id: string;
  name: string;
  price: number;
  imageKeywords: string[];
};

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="catalogue" className="bg-background px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading title="Catalogue" />

        {products.length === 0 ? (
          <p className="mt-12 text-center font-sans text-foreground">
            Aucun produit pour le moment.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
            {products.map((product) => {
              const image = getProductImage(product.id);

              return (
                <li key={product.id}>
                  <Link href={`/produits/${product.id}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-section">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          sizes="(min-width: 640px) 33vw, 50vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        // Repli si aucune photo n'est connue pour ce produit.
                        <div
                          role="img"
                          aria-label={`Photo à venir : ${product.imageKeywords.join(", ")}`}
                          className="h-full w-full bg-section"
                        />
                      )}
                      {/* Badge prix en médaillon, sur l'angle de l'image. */}
                      <span className="absolute top-3 right-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-center font-serif text-sm text-foreground shadow">
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                    <p className="mt-4 text-center font-serif text-lg tracking-wide text-foreground">
                      {product.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
