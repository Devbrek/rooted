import { ThinBanner } from "@/components/thin-banner";
import { ShopMapLoader } from "@/components/shop-map-loader";
import { SHOPS } from "@/lib/shops";

export default function ShopsPage() {
  return (
    <main>
      <ThinBanner title="Nos boutiques" />

      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
        <p className="border border-accent/30 bg-section px-4 py-3 text-center font-sans text-sm text-foreground/80">
          Boutiques fictives : ces adresses n&apos;existent pas, elles
          illustrent une fonctionnalité de démonstration.
        </p>

        <ShopMapLoader />

        <ul className="grid gap-6 sm:grid-cols-3">
          {SHOPS.map((shop) => (
            <li
              key={shop.name}
              className="flex flex-col gap-1 bg-section px-6 py-6 text-center"
            >
              <p className="font-serif text-lg text-foreground">
                {shop.name}
              </p>
              <p className="font-sans text-sm text-foreground/80">
                {shop.city}
              </p>
              <p className="font-sans text-sm text-foreground/70">
                {shop.hours}
              </p>
              <p className="mt-2 font-sans text-sm text-foreground/70">
                {shop.phone}
              </p>
              <p className="font-sans text-sm text-foreground/70">
                {shop.email}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
