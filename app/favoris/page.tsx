import { prisma } from "@/lib/prisma";
import { ThinBanner } from "@/components/thin-banner";
import { FavoritesList } from "@/components/favorites-list";

export default async function FavoritesPage() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <ThinBanner title="Vos favoris" />
      <FavoritesList products={products} />
    </main>
  );
}
