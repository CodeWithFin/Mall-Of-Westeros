'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
  brand: string;
  slug: string;
  stockQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Record<string, unknown>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mall-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('mall-cart', JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = (product: Record<string, unknown>, quantity = 1) => {
    const stockQuantity = Number(product.stockQuantity) || 0;
    const id = String(product.id);
    const images = product.images;
    const image = Array.isArray(images) ? String(images[0]) : String(images || '');

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, stockQuantity);
        return currentItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [
        ...currentItems,
        {
          id,
          name: String(product.name),
          price: String(product.price),
          quantity: Math.min(quantity, stockQuantity),
          image,
          brand: String(product.brand),
          slug: String(product.slug),
          stockQuantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
