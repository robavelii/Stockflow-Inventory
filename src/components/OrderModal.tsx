import React, { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import { orderSchema } from '../schemas/validationSchemas';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  initialData?: Order;
  products: Product[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  products,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [status, setStatus] = useState<Order['status']>('Pending');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      setStatus(initialData.status);
      
      if (initialData.itemsCount > 0 && products.length > 0) {
        const generatedItems: OrderItem[] = [];
        let remainingTotal = initialData.total;
        let remainingCount = initialData.itemsCount;
        
        while (remainingCount > 0 && remainingTotal > 0) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.min(remainingCount, Math.ceil(Math.random() * 3));
          const itemTotal = randomProduct.price * quantity;
          
          if (itemTotal <= remainingTotal || generatedItems.length === 0) {
            generatedItems.push({
              productId: randomProduct.id,
              quantity,
              price: randomProduct.price,
            });
            remainingTotal -= itemTotal;
            remainingCount -= quantity;
          } else {
            break;
          }
        }
        
        if (generatedItems.length === 0 && products.length > 0) {
          const firstProduct = products[0];
          generatedItems.push({
            productId: firstProduct.id,
            quantity: initialData.itemsCount || 1,
            price: initialData.total / (initialData.itemsCount || 1),
          });
        }
        
        setOrderItems(generatedItems);
      }
    } else {
      setCustomerName('');
      setStatus('Pending');
      setOrderItems([]);
    }
  }, [initialData, isOpen, products]);

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (products.length === 0) {
      toast.error('No products available');
      return;
    }
    setOrderItems([
      ...orderItems,
      {
        productId: products[0].id,
        quantity: 1,
        price: products[0].price,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        updated[index].price = product.price;
      }
    }
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('At least one item is required');
      return;
    }

    const payload = {
      customer: customerName.trim(),
      items: orderItems,
      status,
      notes: '',
    };

    const result = orderSchema.safeParse(payload);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        customerName: customerName.trim(),
        total: calculateTotal(),
        status,
        itemsCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Order' : 'Create New Order'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer Name *</label>
              <input
                required
                type="text"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white ${
                    errors.customer ? 'border-red-500' : 'border-slate-300 dark:border-gray-600'
                }`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
              />
              {errors.customer && <p className="text-xs text-red-500">{errors.customer}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white"
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Order Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Item
              </button>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                No items added. Click "Add Item" to add products.
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-end p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Product</label>
                      <select
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - ${p.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24 space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, 'price', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtotal</label>
                      <div className="px-3 py-2 bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg text-sm font-medium text-slate-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-700 flex justify-end">
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg border border-slate-200 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || orderItems.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};