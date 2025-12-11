import { Orders } from '@/components/Orders';
import { Order, Product } from '@/types';

interface OrdersPageProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  userId: string;
  products: Product[];
}

export const OrdersPage = ({ orders, setOrders, userId, products }: OrdersPageProps) => {
  return <Orders orders={orders} setOrders={setOrders} userId={userId} products={products} />;
};