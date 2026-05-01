import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image: string;
  available: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItem._id === menuItem._id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menuItem._id === menuItem._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { menuItem, quantity: 1 }],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem._id !== id),
        }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem._id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },

      getTax: () => {
        return get().getSubtotal() * 0.08; // 8% tax
      },

      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'food-delivery-cart',
    }
  )
);