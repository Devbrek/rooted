import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";

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
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
