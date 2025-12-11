import { Customer } from '@/types';

export function mapCustomerFromDB(row: any): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    createdAt: row.created_at,
  };
}
