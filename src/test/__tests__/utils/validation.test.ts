import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidSKU,
  isValidPrice,
  isValidQuantity,
  validateProduct,
} from '@/utils/validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidSKU', () => {
    it('should validate correct SKUs', () => {
      expect(isValidSKU('SKU-001')).toBe(true);
      expect(isValidSKU('ABC123')).toBe(true);
      expect(isValidSKU('PROD_001')).toBe(true);
    });

    it('should reject invalid SKUs', () => {
      expect(isValidSKU('AB')).toBe(false); // too short
      expect(isValidSKU('A'.repeat(51))).toBe(false); // too long
      expect(isValidSKU('SKU 001')).toBe(false); // spaces not allowed
    });
  });

  describe('validateProduct', () => {
    it('should validate correct product', () => {
      const product = {
        name: 'Test Product',
        sku: 'SKU-001',
        price: 100,
        quantity: 10,
      };

      const result = validateProduct(product);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should catch validation errors', () => {
      const product = {
        name: 'A', // too short
        sku: 'AB', // too short
        price: -10, // negative
        quantity: 100001, // too large
      };

      const result = validateProduct(product);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
