import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters').regex(/^[A-Z0-9\-_]+$/i, 'SKU must contain only letters, numbers, hyphens, and underscores'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
  minLevel: z.number().int('Min Level must be an integer').min(0, 'Min Level cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative'),
  supplier: z.string().min(1, 'Supplier is required'),
  location: z.string().optional(),
});

export const orderSchema = z.object({
  customer: z.string().min(1, 'Customer name is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price cannot be negative'),
  })).min(1, 'Order must have at least one item'),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  notes: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
