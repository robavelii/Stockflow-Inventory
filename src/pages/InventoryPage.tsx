import { InventoryList } from '@/components/InventoryList';
import { Product, AppView } from '@/types';

interface InventoryPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCurrentView: (view: AppView) => void;
  userId: string;
  searchQuery?: string;
}

export const InventoryPage = ({
  products,
  setProducts,
  setCurrentView,
  userId,
  searchQuery,
}: InventoryPageProps) => {
  return (
    <InventoryList
      products={products}
      setProducts={setProducts}
      setCurrentView={setCurrentView}
      userId={userId}
      searchQuery={searchQuery}
    />
  );
};