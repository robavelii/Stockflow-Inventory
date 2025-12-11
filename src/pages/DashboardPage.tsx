import { Dashboard } from '@/components/Dashboard';
import { Product, Order } from '@/types';

interface DashboardPageProps {
  products: Product[];
  orders: Order[];
}

export const DashboardPage = ({ products, orders }: DashboardPageProps) => {
  return <Dashboard products={products} orders={orders} />;
};
