import { Product } from '@/types';

export function mapProductFromDB(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    category: row.category,
    quantity: row.quantity,
    minLevel: row.min_level,
    price: row.price,
    cost: row.cost,
    status: row.status,
    lastUpdated: row.updated_at,
    supplier: row.supplier,
  };
}
