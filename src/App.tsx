import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { AppView, Product, Order } from './types';
import { useAuth } from './contexts/AuthContext';
import { productService, orderService } from '@/services';
import { preferencesService } from '@/services/preferences';
import { Menu, Package, ChevronRight, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { NotificationCenter } from '@/features/notifications';

// Code-split page components for better performance
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const InventoryPage = lazy(() =>
  import('./pages/InventoryPage').then((m) => ({ default: m.InventoryPage }))
);
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const Team = lazy(() => import('./components/Team').then((m) => ({ default: m.Team })));
const Reports = lazy(() => import('./components/Reports').then((m) => ({ default: m.Reports })));
const DataManager = lazy(() =>
  import('./components/DataManager').then((m) => ({ default: m.DataManager }))
);
const Settings = lazy(() => import('./components/Settings').then((m) => ({ default: m.Settings })));

// Map routes to AppView enums for backwards compatibility
const routeToView: Record<string, AppView> = {
  '/': AppView.DASHBOARD,
  '/inventory': AppView.INVENTORY,
  '/orders': AppView.ORDERS,
  '/team': AppView.TEAM,
  '/reports': AppView.REPORTS,
  '/data': AppView.DATA_MANAGER,
  '/settings': AppView.SETTINGS,
};

const viewToRoute: Record<AppView, string> = {
  [AppView.DASHBOARD]: '/',
  [AppView.INVENTORY]: '/inventory',
  [AppView.ORDERS]: '/orders',
  [AppView.TEAM]: '/team',
  [AppView.REPORTS]: '/reports',
  [AppView.DATA_MANAGER]: '/data',
  [AppView.SETTINGS]: '/settings',
};

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  /* duplicate line removed */
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadData();
      loadTheme();
    } else {
      setProducts([]);
      setOrders([]);
      setDataLoading(false);
      // Reset theme when logging out
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('stockflow-theme');
    }
  }, [user]);

  const loadTheme = async () => {
    if (!user) return;
    
    // First, apply theme from localStorage for instant UI update
    const cachedTheme = localStorage.getItem('stockflow-theme');
    if (cachedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (cachedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    
    // Then fetch from database
    try {
      const prefs = await preferencesService.get(user.id);
      const isDark = prefs.darkMode;
      
      // Update localStorage cache
      localStorage.setItem('stockflow-theme', isDark ? 'dark' : 'light');
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // If error, keep whatever was in localStorage/default
    }
  };

  const loadData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        productService.getAll(user.id),
        orderService.getAll(user.id),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Loading component for Suspense fallback
  const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading page...</p>
      </div>
    </div>
  );

  // Determine current view from location for Sidebar highlighting
  const currentView = routeToView[location.pathname] || AppView.DASHBOARD;

  const handleNavigate = (view: AppView) => {
    const path = viewToRoute[view];
    if (path) {
      navigate(path);
    }
  };

  const getBreadcrumb = () => {
    const viewMap: Record<string, string> = {
      [AppView.DASHBOARD]: 'Overview',
      [AppView.INVENTORY]: 'Inventory',
      [AppView.ORDERS]: 'Orders',
      [AppView.TEAM]: 'Team',
      [AppView.REPORTS]: 'Reports',
      [AppView.DATA_MANAGER]: 'Data Manager',
      [AppView.SETTINGS]: 'Settings',
    };
    return viewMap[currentView] || 'Overview';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex font-sans text-gray-900 dark:text-gray-100 selection:bg-primary-100 selection:text-primary-900">
      <Sidebar
        currentView={currentView}
        setCurrentView={handleNavigate}
        currentUser={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-900 z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">StockFlow</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 dark:text-gray-400"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-30 pt-20 px-6 space-y-6">
          <button
            onClick={() => {
              handleNavigate(AppView.DASHBOARD);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Overview
          </button>
          <button
            onClick={() => {
              handleNavigate(AppView.INVENTORY);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Inventory
          </button>
          <button
            onClick={() => {
              handleNavigate(AppView.ORDERS);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Orders
          </button>
          <button
            onClick={() => {
              handleNavigate(AppView.TEAM);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Team
          </button>
          <button
            onClick={() => {
              handleNavigate(AppView.REPORTS);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Reports
          </button>
          <button
            onClick={() => {
              handleNavigate(AppView.SETTINGS);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left text-lg font-medium text-gray-900 dark:text-white"
          >
            Settings
          </button>
          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-4"></div>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-600 text-lg font-medium"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">StockFlow</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-gray-800 dark:text-white">{getBreadcrumb()}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Quick search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleNavigate(AppView.INVENTORY);
                  }
                }}
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm w-48 focus:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 focus:border-primary-300 dark:focus:border-primary-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <NotificationCenter products={products} />
          </div>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage products={products} orders={orders} />} />
              <Route
                path="/inventory"
                element={
                  <InventoryPage
                    products={products}
                    setProducts={setProducts}
                    setCurrentView={handleNavigate}
                    userId={user.id}
                    searchQuery={searchQuery}
                  />
                }
              />
              <Route
                path="/orders"
                element={
                  <OrdersPage
                    orders={orders}
                    setOrders={setOrders}
                    userId={user.id}
                    products={products}
                  />
                }
              />
              <Route path="/team" element={<Team />} />
              <Route path="/reports" element={<Reports products={products} />} />
              <Route
                path="/data"
                element={
                  <DataManager
                    products={products}
                    setProducts={setProducts}
                    userId={user.id}
                    onDataChange={loadData}
                  />
                }
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<DashboardPage products={products} orders={orders} />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}