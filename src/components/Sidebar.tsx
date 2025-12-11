import { AppView, User } from '../types';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Database,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  onLogout,
  isCollapsed,
  toggleCollapse,
}) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Overview', icon: LayoutDashboard, path: '/' },
    { view: AppView.INVENTORY, label: 'Inventory', icon: Package, path: '/inventory' },
    { view: AppView.ORDERS, label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { view: AppView.TEAM, label: 'Team', icon: Users, path: '/team' },
    { view: AppView.REPORTS, label: 'Reports', icon: FileText, path: '/reports' },
    { view: AppView.DATA_MANAGER, label: 'Data Manager', icon: Database, path: '/data' },
    { view: AppView.SETTINGS, label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-gray-900 h-screen fixed left-0 top-0 z-50 border-r border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-20 flex items-center px-6 border-b border-gray-50 dark:border-gray-800 ${isCollapsed ? 'justify-center px-0' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/30 flex-shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                StockFlow
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">Enterprise Edition</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.view}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              `group flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 shadow-glow" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-24 z-50">
        <button
          onClick={toggleCollapse}
          className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full p-1.5 text-gray-500 shadow-md hover:text-primary-600 hover:scale-110 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer group">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="User"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.role}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <img
              src={currentUser.avatar}
              alt="User"
              className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 border border-white dark:border-gray-600 shadow-sm"
            />
          </div>
        )}

        <button
          onClick={onLogout}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};