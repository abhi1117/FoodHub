import { useCallback } from 'react';
import { useCartStore, MenuItem } from '@/store/cartStore';

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    getItemCount,
  } = useCartStore();

  const handleAddItem = useCallback((menuItem: MenuItem) => {
    addItem(menuItem);
  }, [addItem]);

  const handleRemoveItem = useCallback((id: string) => {
    removeItem(id);
  }, [removeItem]);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    updateQuantity(id, quantity);
  }, [updateQuantity]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  return {
    items,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    subtotal: getSubtotal(),
    tax: getTax(),
    total: getTotal(),
    itemCount: getItemCount(),
  };
}