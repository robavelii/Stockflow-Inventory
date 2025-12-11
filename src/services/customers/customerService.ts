import { supabase } from '@/lib/supabase';
import { Customer } from '@/types';
import { mapCustomerFromDB } from './customerMapper';

export const customerService = {
  async getAll(userId: string): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapCustomerFromDB);
  },

  async getById(id: string, userId: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data ? mapCustomerFromDB(data) : null;
  },

  async create(customer: Omit<Customer, 'id' | 'createdAt'>, userId: string): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return mapCustomerFromDB(data);
  },

  async update(id: string, updates: Partial<Customer>, userId: string): Promise<Customer> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.address !== undefined) updateData.address = updates.address;

    const { data, error } = await supabase
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapCustomerFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase.from('customers').delete().eq('id', id).eq('user_id', userId);

    if (error) throw error;
  },
};
