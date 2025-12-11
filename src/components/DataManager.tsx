import React, { useState } from 'react';
import { Product } from '@/types';
import { productSchema } from '@/schemas/validationSchemas';
import {
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';

import { productService } from '@/services';
import toast from 'react-hot-toast';

interface DataManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  userId: string;
  onDataChange: () => void;
}

interface ImportStatus {
  type: 'success' | 'error';
  message: string;
  details?: string[];
}

export const DataManager: React.FC<DataManagerProps> = ({
  products,
  setProducts,
  userId,
  onDataChange,
}) => {
  const [status, setStatus] = useState<ImportStatus | null>(null);

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Quantity', 'Min Level', 'Price', 'Supplier'];
    const rows = products.map((p) =>
      [
        p.id,
        `"${p.name}"`, // Quote name to handle commas
        p.sku,
        p.category,
        p.quantity,
        p.minLevel,
        p.price,
        `"${p.supplier}"`,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stockflow_inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');

        if (lines.length < 2) throw new Error('File appears to be empty or missing data rows.');

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));

        const getIdx = (keywords: string[]) =>
          headers.findIndex((h) => keywords.some((k) => h.includes(k)));

        const map = {
          name: getIdx(['name', 'product']),
          sku: getIdx(['sku', 'code']),
          category: getIdx(['category', 'type']),
          qty: getIdx(['quantity', 'qty', 'stock']),
          price: getIdx(['price', 'cost']),
          supplier: getIdx(['supplier', 'vendor']),
        };

        const missing = [];
        if (map.name === -1) missing.push('Name');
        if (map.qty === -1) missing.push('Quantity');
        if (map.price === -1) missing.push('Price');

        if (missing.length > 0) throw new Error(`Missing required columns: ${missing.join(', ')}`);

        const newProducts: Product[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Basic split, note: real CSV parsing handles quoted commas better
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));

          if (cols.length <= 1) continue;

          try {
            const name = cols[map.name];
            const qty = parseFloat(cols[map.qty]);
            const price = parseFloat(cols[map.price]);

            if (isNaN(qty) || isNaN(price)) throw new Error('Invalid number format');

            // Infer status
            const minLevel = 10; // Default
            let status: Product['status'] = 'In Stock';
            if (qty === 0) status = 'Out of Stock';
            else if (qty <= minLevel) status = 'Low Stock';

            const productData = {
              name,
              sku: map.sku > -1 ? cols[map.sku] : `SKU-${Math.floor(Math.random() * 10000)}`,
              category: map.category > -1 ? cols[map.category] : 'Uncategorized',
              quantity: qty,
              minLevel,
              price,
              supplier: map.supplier > -1 ? cols[map.supplier] : 'Unknown',
            };

            // Validate with Zod
            const validation = productSchema.safeParse(productData);
            if (!validation.success) {
               const issues = validation.error.issues.map(i => `${String(i.path[0])}: ${i.message}`).join(', ');
               throw new Error(issues);
            }

            newProducts.push({
              id: crypto.randomUUID(),
              ...productData,
              cost: price * 0.6,
              status,
              lastUpdated: new Date().toISOString(),
            });
          } catch (rowErr) {
            const errorMsg = rowErr instanceof Error ? rowErr.message : String(rowErr);
            errors.push(`Row ${i + 1}: ${errorMsg}`);
          }
        }

        if (errors.length > 0) {
          setStatus({
            type: 'error',
            message: `Validation failed for ${errors.length} row(s).`,
            details: errors.length > 10 ? [...errors.slice(0, 10), '...'] : errors,
          });
        } else if (newProducts.length === 0) {
          setStatus({ type: 'error', message: 'No valid data rows found.' });
        } else {
          // Import products to Supabase
          try {
            for (const product of newProducts) {
              await productService.create(
                {
                  name: product.name,
                  sku: product.sku,
                  category: product.category,
                  quantity: product.quantity,
                  minLevel: product.minLevel,
                  price: product.price,
                  cost: product.cost,
                  status: product.status,
                  supplier: product.supplier,
                },
                userId
              );
            }
            toast.success(`Successfully imported ${newProducts.length} items.`);
            setStatus({
              type: 'success',
              message: `Successfully imported ${newProducts.length} items.`,
            });
            onDataChange();
          } catch (error: any) {
            setStatus({
              type: 'error',
              message: `Failed to import: ${error.message}`,
            });
          }
        }
      } catch (err) {
        setStatus({
          type: 'error',
          message: (err as Error).message,
        });
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Management</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage bulk inventory data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Export Inventory</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Download full product list as CSV.</p>
          <button
            onClick={exportCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-primary-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Import Inventory</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Upload CSV with columns: Name, Quantity, Price.
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 dark:file:bg-emerald-900/30 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/50 cursor-pointer"
          />
          {status && (
            <div
              className={`mt-4 p-3 rounded text-xs ${status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
            >
              <p className="font-bold">{status.message}</p>
              {status.details && (
                <ul className="mt-1 list-disc pl-4">
                  {status.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};