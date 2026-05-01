import { useCallback } from 'react';
import { useOrderStore, Order, Customer, OrderItem } from '@/store/orderStore';

export function useOrder() {
  const {
    orders,
    currentOrder,
    isLoading,
    error,
    setOrders,
    setCurrentOrder,
    addOrder,
    updateOrder,
    setLoading,
    setError,
    clearError,
  } = useOrderStore();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/orders');
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setOrders, setLoading, setError, clearError]);

  const fetchOrderById = useCallback(async (id: string) => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/orders/${id}`);
      const result = await response.json();

      if (result.success) {
        setCurrentOrder(result.data);
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch order');
        return null;
      }
    } catch (err) {
      setError('An error occurred while fetching order');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentOrder, setLoading, setError, clearError]);

  const createOrder = useCallback(async (customer: Customer, items: OrderItem[], subtotal: number, tax: number, total: number) => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
          tax,
          total,
        }),
      });

      const result = await response.json();

      if (result.success) {
        addOrder(result.data);
        return result.data;
      } else {
        setError(result.error || 'Failed to create order');
        return null;
      }
    } catch (err) {
      setError('An error occurred while creating order');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [addOrder, setLoading, setError, clearError]);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    setLoading(true);
    clearError();

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        updateOrder(result.data);
        return result.data;
      } else {
        setError(result.error || 'Failed to update order');
        return null;
      }
    } catch (err) {
      setError('An error occurred while updating order');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateOrder, setLoading, setError, clearError]);

  return {
    orders,
    currentOrder,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    clearError,
  };
}