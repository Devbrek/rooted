"use client";

import dynamic from "next/dynamic";

// Leaflet touche window/document au chargement : chargé uniquement côté
// navigateur (ssr: false), ce qui n'est autorisé que depuis un composant
// client, d'où ce fichier séparé de app/boutiques/page.tsx (Server Component).
const ShopMap = dynamic(() => import("@/components/shop-map"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-map w-full items-center justify-center bg-section">
      <p className="font-sans text-sm text-foreground/70">
        Chargement de la carte…
      </p>
    </div>
  ),
});

export function ShopMapLoader() {
  return (
    // "isolate" enferme les z-index internes de Leaflet (jusqu'à ~1000, pour
    // ses panneaux et contrôles) dans ce conteneur, pour qu'ils ne passent
    // jamais au-dessus du header collant (z-40) ou du toast (z-50).
    <div className="relative isolate">
      <ShopMap />
    </div>
  );
}
