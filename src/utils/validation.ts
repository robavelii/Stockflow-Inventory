/**
 * Validation utilities
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export function isValidSKU(sku: string): boolean {
  return sku.length >= 3 && sku.length <= 50 && /^[A-Z0-9\-_]+$/i.test(sku);
}

export function isValidPrice(price: number): boolean {
  return price >= 0 && price <= 1000000;
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 0 && quantity <= 100000;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProduct(product: Partial<any>): ValidationResult {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }

  if (product.sku && !isValidSKU(product.sku)) {
    errors.push(
      'SKU must be 3-50 characters and contain only letters, numbers, hyphens, or underscores'
    );
  }

  if (product.price !== undefined && !isValidPrice(product.price)) {
    errors.push('Price must be between 0 and 1,000,000');
  }

  if (product.quantity !== undefined && !isValidQuantity(product.quantity)) {
    errors.push('Quantity must be a non-negative integer up to 100,000');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
