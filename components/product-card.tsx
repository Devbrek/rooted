import Image from "next/image";
import Link from "next/link";
import { getProductImage } from "@/lib/product-images";

type Product = {
  id: string;
  name: string;
  price: number;
  imageKeywords: string[];
};

// Carte catalogue réutilisable : photo carrée, badge prix en médaillon sur
// l'angle de l'image, nom en serif. Utilisée par la grille catalogue et par
// le bandeau "produits similaires" de la fiche produit.
export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product.id);

  return (
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
        <span className="absolute top-3 right-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-center font-serif text-sm text-foreground shadow">
          {product.price.toFixed(2)} €
        </span>
      </div>
      <p className="mt-4 text-center font-serif text-lg tracking-wide text-foreground">
        {product.name}
      </p>
    </Link>
  );
}
