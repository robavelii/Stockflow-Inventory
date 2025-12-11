import { Order } from '@/types';

export function mapOrderFromDB(row: any): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    date: row.created_at,
    total: row.total,
    status: row.status,
    itemsCount: row.items_count,
  };
}
