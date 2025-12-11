import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productService } from '@/services/products';

// Mock Supabase
vi.mock('@/lib/supabase', () => {
  const mockSupabase = {
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    eq: vi.fn(() => mockSupabase),
    order: vi.fn(() => mockSupabase),
  };
  return { supabase: mockSupabase };
});

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should handle service structure', () => {
      expect(productService).toBeDefined();
      expect(typeof productService.getAll).toBe('function');
    });
  });
});
