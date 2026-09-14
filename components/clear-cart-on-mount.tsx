"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-context";

// Vide le panier une seule fois, au montage — utilisé sur /confirmation
// une fois le paiement vérifié côté serveur.
export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // clearCart n'est pas mémoïsée par CartProvider : ne pas l'ajouter aux
    // dépendances, pour que cet effet ne s'exécute qu'au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
