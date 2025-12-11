import React, { useState } from 'react';
import { Order, Product } from '../types';
import { Truck, CheckCircle, Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { OrderModal } from './OrderModal';
import { orderService } from '@/services/orders';
import toast from 'react-hot-toast';

interface OrdersProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  userId: string;
  products: Product[];
}

export const Orders: React.FC<OrdersProps> = ({ orders, setOrders, userId, products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

  const handleCreate = () => {
    setEditingOrder(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.delete(id, userId);
        setOrders((prev) => prev.filter((o) => o.id !== id));
        toast.success('Order deleted successfully');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete order';
        toast.error(message);
      }
    }
  };

  const handleSubmit = async (orderData: Omit<Order, 'id' | 'date'>) => {
    if (editingOrder) {
      const updated = await orderService.update(editingOrder.id, orderData, userId);
      setOrders((prev) => prev.map((o) => (o.id === editingOrder.id ? updated : o)));
      toast.success('Order updated successfully');
    } else {
      const created = await orderService.create(orderData, userId);
      setOrders((prev) => [created, ...prev]);
      toast.success('Order created successfully');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Order History</h2>
          <p className="text-slate-500 dark:text-slate-400">Track and manage customer shipments</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="bg-white dark:bg-gray-800 border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-emerald-600">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.customerName}</td>
                  <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{order.itemsCount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                          : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                            : order.status === 'Processing'
                              ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                      {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingOrder}
        products={products}
      />
    </div>
  );
};