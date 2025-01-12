'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  isim: string;
  fiyat: number;
  miktar: number;
  ana_fotograf: string;
  hacim: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'miktar'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sepeti localStorage'dan yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sepeti localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sepete ürün ekle
  const addToCart = (item: Omit<CartItem, 'miktar'>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, miktar: cartItem.miktar + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, miktar: 1 }];
    });
  };

  // Sepetten ürün çıkar
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Ürün miktarını güncelle
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, miktar: quantity } : item
      )
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setCart([]);
  };

  // Toplam ürün sayısı
  const totalItems = cart.reduce((total, item) => total + item.miktar, 0);

  // Toplam fiyat
  const totalPrice = cart.reduce((total, item) => total + (item.fiyat * item.miktar), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
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
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 