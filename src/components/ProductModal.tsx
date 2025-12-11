import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { productSchema } from '../schemas/validationSchemas';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Partial<Product>) => void;
  initialData?: Product;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Electronics',
    quantity: 0,
    minLevel: 10,
    price: 0,
    supplier: '',
    status: 'In Stock',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({});
       
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: '',
          sku: '',
          category: 'Electronics',
          quantity: 0,
          minLevel: 10,
          price: 0,
          supplier: '',
          status: 'Out of Stock',
        });
      }
    }
    prevIsOpen.current = isOpen;
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auto calculate status based on qty
    let status: Product['status'] = 'In Stock';
    if ((formData.quantity || 0) === 0) status = 'Out of Stock';
    else if ((formData.quantity || 0) <= (formData.minLevel || 0)) status = 'Low Stock';

    const cleanData = {
      ...formData,
      status,
      // Ensure specific types
      name: formData.name || '',
      sku: formData.sku || '',
      category: formData.category || 'Electronics',
      quantity: Number(formData.quantity) || 0,
      minLevel: Number(formData.minLevel) || 0,
      price: Number(formData.price) || 0,
      supplier: formData.supplier || '',
    };

    const result = productSchema.safeParse(cleanData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    onSubmit({ ...formData, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Name</label>
              <input
                required
                type="text"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SKU</label>
              <input
                required
                type="text"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.sku ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Accessories">Accessories</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Supplier</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.supplier ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
              {errors.supplier && <p className="text-xs text-red-500">{errors.supplier}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Price ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.price ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
              {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Quantity</label>
              <input
                required
                type="number"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.quantity ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Min Level</label>
              <input
                required
                type="number"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none ${
                    errors.minLevel ? 'border-red-500' : 'border-slate-300'
                }`}
                value={formData.minLevel}
                onChange={(e) => setFormData({ ...formData, minLevel: parseInt(e.target.value) })}
              />
              {errors.minLevel && <p className="text-xs text-red-500">{errors.minLevel}</p>}
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};