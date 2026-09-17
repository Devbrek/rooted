"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { SHOPS } from "@/lib/shops";

// Icône de marqueur écrite à la main (SVG en divIcon), pour éviter le
// problème connu des icônes par défaut de Leaflet (chemins d'image cassés
// par les bundlers) sans ajouter d'image externe. Couleurs alignées sur les
// jetons de globals.css (--color-secondary, --color-foreground,
// --color-background), en dur car ce balisage échappe au rendu Tailwind.
const shopIcon = L.divIcon({
  className: "shop-marker",
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#7a8b6f" stroke="#2a2a26" stroke-width="1"><path d="M12 22s7-7.58 7-13A7 7 0 0 0 5 9c0 5.42 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5" fill="#fafaf8"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function ShopMap() {
  return (
    <MapContainer
      center={[46.6, 2.2]}
      zoom={5}
      scrollWheelZoom={false}
      className="aspect-map w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {SHOPS.map((shop) => (
        <Marker key={shop.name} position={shop.position} icon={shopIcon}>
          <Popup>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-foreground">{shop.name}</p>
              <p className="font-sans text-sm text-foreground/80">
                {shop.city}
              </p>
              <p className="font-sans text-sm text-foreground/80">
                {shop.hours}
              </p>
              <p className="font-sans text-sm text-foreground/80">
                {shop.phone}
              </p>
              <p className="font-sans text-sm text-foreground/80">
                {shop.email}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
