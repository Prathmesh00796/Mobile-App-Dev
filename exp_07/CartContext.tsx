import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  deleteItem: (productId: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
}

// Step 48: Create a Context object using createContext()
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Step 48: Create a CartProvider component holding cart state via useState
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add item: if exists increment quantity, otherwise add new with quantity 1
  const addItem = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Remove item: decrement quantity, or remove if quantity reaches 0
  const removeItem = (productId: number) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === productId);
      if (!existing) return prevItems;
      if (existing.quantity <= 1) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Delete item: immediately remove from cart regardless of quantity
  const deleteItem = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
  };

  // Compute total items count
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        deleteItem,
        clearCart,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for convenient consumption
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
