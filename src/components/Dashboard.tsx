import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Product, Order } from '../types';
import {
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Download,
  Calendar,
  LucideIcon,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface KPICardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  colorClass: string;
  iconColor: string;
}

function KPICard({ title, value, subValue, icon: Icon, colorClass, iconColor }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3.5 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>+4.2%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium">{subValue}</p>
      </div>
    </div>
  );
}

type DateRange = '7d' | '14d' | '30d' | '90d';

interface DashboardProps {
  products: Product[];
  orders: Order[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>('7d');
  const [chartRange, setChartRange] = useState<'week' | 'lastweek'>('week');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
  ];

  const getDaysFromRange = (range: DateRange): number => {
    const map: Record<DateRange, number> = { '7d': 7, '14d': 14, '30d': 30, '90d': 90 };
    return map[range];
  };

  const filteredOrders = useMemo(() => {
    const days = getDaysFromRange(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return orders.filter((o) => new Date(o.date) >= cutoff);
  }, [orders, dateRange]);

  const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const lowStockItems = products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
  );
  const pendingOrders = filteredOrders.filter((o) => o.status === 'Pending').length;

  const categoryData = products.reduce((acc: { name: string; value: number }[], p) => {
    const existing = acc.find((i) => i.name === p.category);
    if (existing) {
      existing.value += p.quantity;
    } else {
      acc.push({ name: p.category, value: p.quantity });
    }
    return acc;
  }, []);

  const COLORS = ['#ea580c', '#f59e0b', '#78716c', '#d6d3d1', '#10b981'];

  const salesData = useMemo(() => {
    const chartOrders = chartRange === 'week' 
      ? filteredOrders.slice(0, 7)
      : filteredOrders.slice(7, 14);
    
    if (chartOrders.length === 0) {
      return [{ name: 'No data', sales: 0 }];
    }
    
    return chartOrders
      .reverse()
      .map((o) => ({
        name: new Date(o.date).toLocaleDateString(undefined, { weekday: 'short' }),
        sales: o.total,
      }));
  }, [filteredOrders, chartRange]);

  const chartCategoryData = categoryData.length > 0 
    ? categoryData 
    : [{ name: 'No products', value: 1 }];

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: dateRangeOptions.find(o => o.value === dateRange)?.label,
      summary: {
        totalInventoryValue: totalValue,
        activeProducts: products.length,
        pendingOrders,
        criticalStockItems: lowStockItems.length,
      },
      orders: filteredOrders.map(o => ({
        id: o.id,
        customer: o.customerName,
        date: o.date,
        total: o.total,
        status: o.status,
        items: o.itemsCount,
      })),
      lowStockProducts: lowStockItems.map(p => ({
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        minLevel: p.minLevel,
        status: p.status,
      })),
      categoryDistribution: categoryData,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stockflow-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{dateRangeOptions.find(o => o.value === dateRange)?.label}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateRange(option.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl ${
                      dateRange === option.value ? 'text-primary-600 font-medium' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          subValue="Across 3 Warehouses"
          icon={DollarSign}
          colorClass="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600"
        />
        <KPICard
          title="Active Products"
          value={products.length}
          subValue="12 added this week"
          icon={Package}
          colorClass="bg-stone-100 dark:bg-stone-800"
          iconColor="text-stone-600 dark:text-stone-400"
        />
        <KPICard
          title="Pending Orders"
          value={pendingOrders}
          subValue={`In ${dateRangeOptions.find(o => o.value === dateRange)?.label.toLowerCase()}`}
          icon={ShoppingCart}
          colorClass="bg-amber-50 dark:bg-amber-900/30"
          iconColor="text-amber-600"
        />
        <KPICard
          title="Critical Stock"
          value={lowStockItems.length}
          subValue="Items below min level"
          icon={AlertTriangle}
          colorClass="bg-red-50 dark:bg-red-900/30"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trends</h3>
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value as 'week' | 'lastweek')}
              className="bg-gray-50 dark:bg-gray-700 border-none text-sm text-gray-500 dark:text-gray-300 rounded-lg py-1 px-3 focus:ring-0 cursor-pointer hover:text-gray-900 dark:hover:text-white"
            >
              <option value="week">This Week</option>
              <option value="lastweek">Last Week</option>
            </select>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis
                  dataKey="name"
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#a8a29e"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="$"
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: '#1c1917', fontWeight: 600 }}
                  cursor={{ stroke: '#fdba74', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#ea580c"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-7 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Inventory Mix</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Distribution by category</p>
          <div style={{ width: '100%', height: 250, minHeight: 250 }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {chartCategoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Low Stock Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Critical Stock Alerts</h3>
          <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
            View All Alerts
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Available</th>
                <th className="px-6 py-4">Min Level</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.sku}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">{p.quantity}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.minLevel}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'Out of Stock'
                            ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/30 dark:border-red-800'
                            : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-8 h-8 mb-2 opacity-20" />
                      All stock levels are healthy.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};