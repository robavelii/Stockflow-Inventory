import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load all page components
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const InventoryPage = lazy(() =>
  import('../pages/InventoryPage').then((m) => ({ default: m.InventoryPage }))
);
const OrdersPage = lazy(() =>
  import('../pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const Team = lazy(() => import('../components/Team').then((m) => ({ default: m.Team })));
const Reports = lazy(() => import('../components/Reports').then((m) => ({ default: m.Reports })));
const DataManager = lazy(() =>
  import('../components/DataManager').then((m) => ({ default: m.DataManager }))
);
const Settings = lazy(() =>
  import('../components/Settings').then((m) => ({ default: m.Settings }))
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: 'DASHBOARD',
  },
  {
    path: '/inventory',
    element: 'INVENTORY',
  },
  {
    path: '/orders',
    element: 'ORDERS',
  },
  {
    path: '/team',
    element: 'TEAM',
  },
  {
    path: '/reports',
    element: 'REPORTS',
  },
  {
    path: '/data',
    element: 'DATA_MANAGER',
  },
  {
    path: '/settings',
    element: 'SETTINGS',
  },
];

export const components = {
  DASHBOARD: DashboardPage,
  INVENTORY: InventoryPage,
  ORDERS: OrdersPage,
  TEAM: Team,
  REPORTS: Reports,
  DATA_MANAGER: DataManager,
  SETTINGS: Settings,
};
