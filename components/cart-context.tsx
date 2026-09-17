"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "rooted-cart-v1";
export const MAX_QUANTITY = 10;

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartProduct = {
  id: string;
  name: string;
  price: number;
};

type StoredCartItem = {
  productId: string;
  quantity: number;
};

export type LastAddedItem = {
  name: string;
  quantity: number;
  key: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  lastAdded: LastAddedItem | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function isStoredCartItem(value: unknown): value is StoredCartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { productId, quantity } = value as {
    productId?: unknown;
    quantity?: unknown;
  };
  return (
    typeof productId === "string" &&
    productId.length > 0 &&
    Number.isInteger(quantity) &&
    (quantity as number) >= 1 &&
    (quantity as number) <= MAX_QUANTITY
  );
}

function readStoredItems(): StoredCartItem[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return [];
  }
  if (!raw) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isStoredCartItem);
}

function writeStoredItems(items: CartItem[]) {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const stored: StoredCartItem[] = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Stockage indisponible (navigation privée, quota) : le panier reste en mémoire pour la session.
  }
}

export function CartProvider({
  children,
  products,
}: {
  children: ReactNode;
  products: CartProduct[];
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<LastAddedItem | null>(null);
  const nextToastKeyRef = useRef(0);

  useEffect(() => {
    const stored = readStoredItems();
    const restored: CartItem[] = [];
    for (const entry of stored) {
      if (restored.some((item) => item.productId === entry.productId)) {
        continue;
      }
      const product = products.find(
        (candidate) => candidate.id === entry.productId,
      );
      if (product) {
        restored.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: entry.quantity,
        });
      }
    }
    /* eslint-disable react-hooks/set-state-in-effect -- lecture de localStorage au montage, synchronisation avec un système externe */
    setItems(restored);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // Ne doit s'exécuter qu'une fois, à l'hydratation initiale du stockage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    writeStoredItems(items);
  }, [items, hydrated]);

  function addItem(product: CartProduct, quantity: number = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }

    const existing = items.find((item) => item.productId === product.id);
    const currentQuantity = existing?.quantity ?? 0;
    const nextQuantity = Math.min(currentQuantity + quantity, MAX_QUANTITY);
    const added = nextQuantity - currentQuantity;
    if (added <= 0) {
      return;
    }

    setItems((current) => {
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: nextQuantity }
            : item,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: added,
        },
      ];
    });

    nextToastKeyRef.current += 1;
    setLastAdded({
      name: product.name,
      quantity: added,
      key: nextToastKeyRef.current,
    });
  }

  function removeItem(productId: string) {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }

  function setQuantity(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }
    const clamped = Math.min(quantity, MAX_QUANTITY);
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: clamped } : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Stockage indisponible : rien à supprimer.
    }
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clearCart, lastAdded }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
