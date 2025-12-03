// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import type { Product } from '../types';

export type CartItem = {
  product: Product;
  quantity: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load giỏ hàng từ localStorage khi mở trang
  useEffect(() => {
    const saved = localStorage.getItem('techstore_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('techstore_cart');
      }
    }
  }, []);

  // Lưu giỏ hàng mỗi khi thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('techstore_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('techstore_cart');
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const exist = prev.find(item => item.product.id === product.id);
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    cart,
    cartCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}