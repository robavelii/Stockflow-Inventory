import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/products';
import toast from 'react-hot-toast';

export function useProducts(userId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!userId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll(userId);
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const createProduct = useCallback(
    async (product: Omit<Product, 'id' | 'lastUpdated'>) => {
      if (!userId) return;
      try {
        const newProduct = await productService.create(product, userId);
        setProducts((prev) => [newProduct, ...prev]);
        toast.success('Product created successfully');
        return newProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create product';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      if (!userId) return;
      try {
        const updated = await productService.update(id, updates, userId);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toast.success('Product updated successfully');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update product';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!userId) return;
      try {
        await productService.delete(id, userId);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete product';
        toast.error(message);
        throw err;
      }
    },
    [userId]
  );

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
