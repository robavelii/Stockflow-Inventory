import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProducts } from '@/hooks/useProducts';
import { productService } from '@/services/products';
import { render } from '@/test/utils/testUtils';

vi.mock('@/services/products');
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useProducts', () => {
  it('should load products on mount', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product',
        sku: 'SKU-001',
        category: 'Electronics',
        quantity: 10,
        minLevel: 5,
        price: 100,
        cost: 60,
        status: 'In Stock' as const,
        lastUpdated: '2024-01-01',
        supplier: 'Test Supplier',
      },
    ];

    vi.mocked(productService.getAll).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts('user-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(productService.getAll).toHaveBeenCalledWith('user-1');
  });

  it('should handle empty userId', () => {
    const { result } = renderHook(() => useProducts(null));

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
