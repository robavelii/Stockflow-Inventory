export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minLevel: number;
  price: number;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  supplier: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  itemsCount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export interface UserPreferences {
  darkMode: boolean;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface EnergyReading {
  timestamp: string;
  breakdown: {
    hvac: number;
    lighting: number;
    plugLoads: number;
    evCharging: number;
  };
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  ORDERS = 'ORDERS',
  TEAM = 'TEAM',
  REPORTS = 'REPORTS',
  DATA_MANAGER = 'DATA_MANAGER',
  SETTINGS = 'SETTINGS',
}
