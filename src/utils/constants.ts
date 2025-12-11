import { Product, Order, User } from '@/types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Morgan',
  email: 'alex.m@stockflow.app',
  role: 'Admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'sarah.c@stockflow.app',
    role: 'Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'u3',
    name: 'Mike Ross',
    email: 'mike.r@stockflow.app',
    role: 'Viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
  {
    id: 'u4',
    name: 'Jessica Day',
    email: 'jess.d@stockflow.app',
    role: 'Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
  },
];

const CATEGORIES = ['Electronics', 'Furniture', 'Office Supplies', 'Accessories', 'Hardware'];
const SUPPLIERS = ['TechGlobal Inc', 'OfficeDepot Wholesale', 'FurniCo', 'Gadget World'];

export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= 25; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const price = Math.floor(Math.random() * 500) + 20;
    const quantity = Math.floor(Math.random() * 150);
    const minLevel = Math.floor(Math.random() * 20) + 10;

    let status: Product['status'] = 'In Stock';
    if (quantity === 0) status = 'Out of Stock';
    else if (quantity <= minLevel) status = 'Low Stock';

    products.push({
      id: `prod_${i}`,
      name: `${category} Item ${String.fromCharCode(65 + (i % 26))}${i}`,
      sku: `SKU-${1000 + i}`,
      category,
      quantity,
      minLevel,
      price,
      cost: Math.floor(price * 0.6),
      status,
      lastUpdated: new Date().toISOString(),
      supplier: SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)],
    });
  }
  return products;
};

export const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  for (let i = 1; i <= 15; i++) {
    orders.push({
      id: `ORD-${2024000 + i}`,
      customerName: `Customer ${i}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      total: Math.floor(Math.random() * 2000) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      itemsCount: Math.floor(Math.random() * 5) + 1,
    });
  }
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_PRODUCTS = generateMockProducts();
export const INITIAL_ORDERS = generateMockOrders();
