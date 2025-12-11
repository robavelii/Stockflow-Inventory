import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  update: vi.fn(() => mockSupabase),
  delete: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(() => ({ data: null, error: null })),
  order: vi.fn(() => mockSupabase),
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));
