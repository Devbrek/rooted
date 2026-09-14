import { prisma } from "@/lib/prisma";
import { HomeHero } from "@/components/home-hero";
import { HomeMission } from "@/components/home-mission";
import { HomeArguments } from "@/components/home-arguments";
import { ProductGrid } from "@/components/product-grid";
import { HomeCitation } from "@/components/home-citation";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <HomeHero />
      <HomeMission />
      <HomeArguments />
      <ProductGrid products={products} />
      <HomeCitation />
    </main>
  );
}
