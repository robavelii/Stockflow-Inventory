import { supabase } from '@/lib/supabase';
import { Order } from '@/types';
import { mapOrderFromDB } from './orderMapper';

export const orderService = {
  async getAll(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapOrderFromDB);
  },

  async getById(id: string, userId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data ? mapOrderFromDB(data) : null;
  },

  async create(order: Omit<Order, 'id' | 'date'>, userId: string): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}`;
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: order.customerName,
        customer_id: null,
        total: order.total,
        status: order.status,
        items_count: order.itemsCount,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return mapOrderFromDB(data);
  },

  async update(id: string, updates: Partial<Order>, userId: string): Promise<Order> {
    const updateData: any = {};
    if (updates.customerName) updateData.customer_name = updates.customerName;
    if (updates.total !== undefined) updateData.total = updates.total;
    if (updates.status) updateData.status = updates.status;
    if (updates.itemsCount !== undefined) updateData.items_count = updates.itemsCount;

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapOrderFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    // Delete order items first
    await supabase.from('order_items').delete().eq('order_id', id);

    // Then delete order
    const { error } = await supabase.from('orders').delete().eq('id', id).eq('user_id', userId);

    if (error) throw error;
  },
};
