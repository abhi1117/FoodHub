import { create } from 'zustand';

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  setOrders: (orders: Order[]) => set({ orders }),
  
  setCurrentOrder: (order: Order | null) => set({ currentOrder: order }),
  
  addOrder: (order: Order) => set((state) => ({
    orders: [order, ...state.orders],
    currentOrder: order,
  })),
  
  updateOrder: (order: Order) => set((state) => ({
    orders: state.orders.map((o) => (o._id === order._id ? order : o)),
    currentOrder: state.currentOrder?._id === order._id ? order : state.currentOrder,
  })),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
}));