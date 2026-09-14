import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
  description: "Décoration d'ambiance nature apaisante.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
