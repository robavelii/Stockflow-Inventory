# StockFlow Inventory - Architecture Guide

## 🏗️ Modular Architecture Overview

This document describes the modular architecture of StockFlow Inventory, following React best practices and separation of concerns.

## 📁 Directory Structure

```
src/
├── pages/              # Page-level components (routing layer)
│   ├── DashboardPage.tsx
│   ├── InventoryPage.tsx
│   ├── OrdersPage.tsx
│   └── index.ts
│
├── features/           # Self-contained feature modules
│   └── notifications/
│       ├── NotificationCenter.tsx
│       └── index.ts
│
├── ui/                 # Reusable UI component library
│   └── components/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── index.ts
│
├── hooks/              # Custom React hooks
│   ├── useProducts.ts
│   ├── useOrders.ts
│   └── index.ts
│
├── services/           # Business logic layer (modular)
│   ├── products/
│   │   ├── productService.ts    # CRUD operations
│   │   ├── productMapper.ts     # Data transformation
│   │   └── index.ts
│   ├── orders/
│   │   ├── orderService.ts
│   │   ├── orderMapper.ts
│   │   └── index.ts
│   ├── customers/
│   │   ├── customerService.ts
│   │   ├── customerMapper.ts
│   │   └── index.ts
│   ├── preferences/
│   │   ├── preferencesService.ts
│   │   ├── preferencesMapper.ts
│   │   └── index.ts
│   ├── aiService.ts
│   └── index.ts        # Central export
│
├── utils/              # Utility functions
│   ├── formatting.ts   # Currency, date, number formatting
│   ├── validation.ts    # Input validation
│   ├── helpers.ts      # General helpers (debounce, etc.)
│   ├── constants.ts     # Constants and mock data
│   └── index.ts
│
├── types/              # TypeScript type definitions
│   └── index.ts
│
├── contexts/           # React Context providers
│   └── AuthContext.tsx
│
├── lib/                # Third-party library configurations
│   └── supabase.ts
│
├── components/         # Feature-specific components
│   ├── Dashboard.tsx
│   ├── InventoryList.tsx
│   ├── Orders.tsx
│   └── ...
│
└── test/               # Testing infrastructure
    ├── setup.ts
    ├── utils/
    ├── mocks/
    └── __tests__/
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**

**Pages** → Route-level components that compose features
**Features** → Self-contained business features
**UI** → Reusable, presentation-only components
**Hooks** → Data fetching and state management
**Services** → Business logic and API calls
**Utils** → Pure utility functions

### 2. **Modular Services**

Each service is broken into:
- **Service** - Business logic and API calls
- **Mapper** - Data transformation (DB ↔ App)
- **Index** - Clean exports

**Example:**
```typescript
// services/products/productService.ts
export const productService = {
  async getAll(userId: string): Promise<Product[]> { ... }
  // ... other methods
};

// services/products/productMapper.ts
export function mapProductFromDB(row: any): Product { ... }

// services/products/index.ts
export { productService } from './productService';
export { mapProductFromDB } from './productMapper';
```

### 3. **Custom Hooks Pattern**

Hooks encapsulate data fetching logic:

```typescript
// hooks/useProducts.ts
export function useProducts(userId: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Data fetching, CRUD operations
  // Error handling
  // Toast notifications
  
  return { products, loading, createProduct, updateProduct, deleteProduct };
}
```

### 4. **UI Component Library**

Reusable, styled components:

```typescript
// ui/components/Button.tsx
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  ...props
}) => { ... }
```

## 📊 Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook (useProducts, useOrders)
    ↓
Service (productService, orderService)
    ↓
Supabase Client
    ↓
Database
```

## 🔄 Component Hierarchy

```
App.tsx
├── AuthProvider (Context)
│   └── App Content
│       ├── Sidebar
│       ├── TopBar
│       │   └── NotificationCenter (Feature)
│       └── Page Component
│           └── Feature Component
│               └── UI Components
```

## 🧪 Testing Strategy

### Unit Tests
- **Utils** - Pure functions (formatting, validation)
- **Services** - Business logic (mocked Supabase)
- **Hooks** - Data management (mocked services)

### Integration Tests
- **Components** - User interactions
- **Features** - End-to-end feature flows

### Test Structure
```
test/
├── setup.ts           # Global test setup
├── utils/             # Test utilities
├── mocks/             # Mock implementations
└── __tests__/         # Test files
    ├── utils/
    ├── services/
    └── hooks/
```

## 📦 Module Size Guidelines

- **Services:** < 100 lines per file
- **Components:** < 300 lines per file
- **Hooks:** < 150 lines per file
- **Utils:** < 200 lines per file

If a file exceeds these limits, consider:
- Breaking into smaller modules
- Extracting sub-functions
- Creating helper functions

## 🔗 Import Patterns

### Absolute Imports (Preferred)
```typescript
import { Product } from '@/types';
import { productService } from '@/services/products';
import { useProducts } from '@/hooks';
import { Button } from '@/ui/components';
```

### Relative Imports (Within Module)
```typescript
// Within same feature/module
import { helper } from './helper';
import { types } from '../types';
```

## 🎨 Styling Approach

- **Tailwind CSS** - Utility-first CSS
- **Component-level styles** - Scoped to components
- **No global CSS** - Except base styles in index.css
- **Consistent design system** - Defined in index.html

## 🔐 Security Patterns

1. **Row Level Security** - Database-level user isolation
2. **Input Validation** - Validate all user inputs
3. **Error Handling** - Graceful error handling throughout
4. **Type Safety** - TypeScript for compile-time safety

## 📈 Performance Considerations

1. **Code Splitting** - Ready for lazy loading
2. **Memoization** - Use React.memo where needed
3. **Debouncing** - For search and filters
4. **Optimistic Updates** - For better UX

## 🚀 Scalability

The modular structure supports:
- **Feature additions** - Add new features in `features/`
- **Service extensions** - Add new services in `services/`
- **UI expansion** - Add components to `ui/`
- **Hook reuse** - Share hooks across features

## 📝 Best Practices

1. **Keep modules focused** - One responsibility per module
2. **Use TypeScript** - Type everything
3. **Write tests** - Test utilities and services
4. **Document complex logic** - Add comments where needed
5. **Follow naming conventions** - Consistent across codebase

---

**This architecture ensures maintainability, testability, and scalability.**

