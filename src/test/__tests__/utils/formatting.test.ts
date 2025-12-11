import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber } from '@/utils/formatting';

describe('formatting utilities', () => {
  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date.toISOString())).toContain('2024');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });
  });
});
