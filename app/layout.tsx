import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

import "./globals.css";
import { prisma } from "@/lib/prisma";
import { CartProvider } from "@/components/cart-context";
import { CartToast } from "@/components/cart-toast";
import { FavoritesProvider } from "@/components/favorites-context";
import { DemoBanner } from "@/components/demo-banner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";

// Titres : serif espacée. Corps : sans-serif discrète. Voir globals.css pour
// leur exposition comme jetons de thème Tailwind (font-serif / font-sans).
const heading = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rooted",
  description: "Site Demo E-commerce - Décoration d'ambiance nature apaisante.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true },
  });

  return (
    <html
      lang="fr"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider products={products}>
          <FavoritesProvider productIds={products.map((product) => product.id)}>
            <DemoBanner />
            <Header />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <CartToast />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
