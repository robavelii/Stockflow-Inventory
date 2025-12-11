import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types';
import { orderService } from '@/services/orders';
import toast from 'react-hot-toast';

export function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll(userId);
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const createOrder = useCallback(
    async (order: Omit<Order, 'id' | 'date'>) => {
      if (!userId) return;
      try {
        const newOrder = await orderService.create(order, userId);
        setOrders((prev) => [newOrder, ...prev]);
        toast.success('Order created successfully');
        return newOrder;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create order';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  const updateOrder = useCallback(
    async (id: string, updates: Partial<Order>) => {
      if (!userId) return;
      try {
        const updated = await orderService.update(id, updates, userId);
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        toast.success('Order updated successfully');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update order';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      if (!userId) return;
      try {
        await orderService.delete(id, userId);
        setOrders((prev) => prev.filter((o) => o.id !== id));
        toast.success('Order deleted successfully');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete order';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
