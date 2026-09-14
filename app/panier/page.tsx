"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleQuantityChange(productId: string, rawValue: string) {
    const value = Number(rawValue);
    if (!Number.isNaN(value)) {
      setQuantity(productId, value);
    }
  }

  return (
    <main>
      <div className="relative">
        {/* Placeholder photo — bandeau brume/forêt (à venir) */}
        <div
          className="h-32 bg-gray-200"
          role="img"
          aria-label="Photo à venir : bandeau brume/forêt"
        />
        <h1>Votre panier</h1>
      </div>

      {items.length === 0 ? (
        <div>
          <p>Votre panier est vide.</p>
          <Link href="/">Retour au catalogue</Link>
        </div>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.productId}>
                {/* Placeholder photo — emplacement de la vraie photo produit */}
                <div
                  className="aspect-square w-20 bg-gray-200"
                  role="img"
                  aria-label={`Photo à venir : ${item.name}`}
                />
                <p>{item.name}</p>
                <span>{item.price.toFixed(2)} €</span>
                <label htmlFor={`quantite-${item.productId}`}>
                  Quantité
                  <input
                    id={`quantite-${item.productId}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      handleQuantityChange(item.productId, event.target.value)
                    }
                  />
                </label>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
                <button type="button" onClick={() => removeItem(item.productId)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <div>
            <p>Sous-total : {total.toFixed(2)} €</p>
            <p>Total : {total.toFixed(2)} €</p>
          </div>

          <button type="button">Passer commande</button>
        </>
      )}
    </main>
  );
}
