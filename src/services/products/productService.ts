import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { mapProductFromDB } from './productMapper';

export const productService = {
  async getAll(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapProductFromDB);
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

    if (error) throw error;
    return data ? mapProductFromDB(data) : null;
  },

  async create(product: Omit<Product, 'id' | 'lastUpdated'>, userId: string): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        min_level: product.minLevel,
        price: product.price,
        cost: product.cost,
        status: product.status,
        supplier: product.supplier,
        image_url: null,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return mapProductFromDB(data);
  },

  async update(id: string, updates: Partial<Product>, userId: string): Promise<Product> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.sku) updateData.sku = updates.sku;
    if (updates.category) updateData.category = updates.category;
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.minLevel !== undefined) updateData.min_level = updates.minLevel;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.cost !== undefined) updateData.cost = updates.cost;
    if (updates.status) updateData.status = updates.status;
    if (updates.supplier) updateData.supplier = updates.supplier;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapProductFromDB(data);
  },

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id).eq('user_id', userId);

    if (error) throw error;
  },
};
