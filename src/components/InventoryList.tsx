import React, { useState } from 'react';
import { Product, AppView } from '../types';
import { Search, Filter, Plus, Trash2, Edit2, UploadCloud, X, RefreshCw } from 'lucide-react';
import { ProductModal } from './ProductModal';

import toast from 'react-hot-toast';
import { productService } from '@/services/products';

interface InventoryListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCurrentView: (view: AppView) => void;
  userId: string;
  searchQuery?: string;
}

export const InventoryList: React.FC<InventoryListProps> = ({
  products,
  setProducts,
  setCurrentView,
  userId,
  searchQuery: externalSearch,
}) => {
  const [search, setSearch] = useState(externalSearch || '');

  React.useEffect(() => {
    if (externalSearch !== undefined) {
      setSearch(externalSearch);
    }
  }, [externalSearch]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Derived lists for dropdowns
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const suppliers = ['All', ...Array.from(new Set(products.map((p) => p.supplier)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSupplier = supplierFilter === 'All' || p.supplier === supplierFilter;

    const price = p.price;
    const min = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
    const max = priceRange.max === '' ? Infinity : parseFloat(priceRange.max);
    const matchesPrice = price >= min && price <= max;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier && matchesPrice;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id, userId);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        const updated = await productService.update(editingProduct.id, data, userId);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
        toast.success('Product updated successfully');
      } else {
        const newProduct = {
          name: data.name!,
          sku: data.sku!,
          category: data.category || 'Uncategorized',
          quantity: data.quantity || 0,
          minLevel: data.minLevel || 10,
          price: data.price || 0,
          cost: (data.price || 0) * 0.6,
          status: data.status || 'Out of Stock',
          supplier: data.supplier || 'Unknown',
        };
        const created = await productService.create(newProduct, userId);
        setProducts((prev) => [created, ...prev]);
        toast.success('Product created successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setSupplierFilter('All');
    setPriceRange({ min: '', max: '' });
  };

  const activeFiltersCount = [
    categoryFilter !== 'All',
    statusFilter !== 'All',
    supplierFilter !== 'All',
    priceRange.min !== '',
    priceRange.max !== '',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Inventory</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage stock, pricing, and suppliers across your store.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentView(AppView.DATA_MANAGER)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
          >
            <UploadCloud className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-900 dark:text-white placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-1 ring-primary-100 dark:ring-primary-800'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-300 outline-none text-gray-900 dark:text-white"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-300 outline-none text-gray-900 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Supplier</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-300 outline-none text-gray-900 dark:text-white"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  className="w-1/2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none text-gray-900 dark:text-white"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  className="w-1/2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 outline-none text-gray-900 dark:text-white"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end pt-2 border-t border-gray-200 dark:border-gray-600 mt-2">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white">{product.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">{product.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            product.quantity > 50
                              ? 'bg-emerald-500'
                              : product.quantity > 20
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (product.quantity / 150) * 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{product.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        product.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                          : product.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                            : 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          product.status === 'In Stock'
                            ? 'bg-emerald-500'
                            : product.status === 'Low Stock'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                      ></span>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{product.supplier}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-8 h-8 mb-2 opacity-20" />
                      <p className="mb-2">No products found</p>
                      {(activeFiltersCount > 0 || search) && (
                        <button
                          onClick={clearFilters}
                          className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> of{' '}
            {products.length} products
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />
    </div>
  );
};