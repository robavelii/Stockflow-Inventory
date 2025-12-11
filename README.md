# StockFlow Inventory Management System

A modern, enterprise-grade inventory management dashboard built with React, TypeScript, and Supabase. Features a modular architecture, comprehensive testing, and production-ready codebase.

## ✨ Features

- ✅ **Real Authentication** - Email/password and OAuth (Google, GitHub)
- ✅ **Product Management** - Full CRUD with search and advanced filters
- ✅ **Order Management** - Create, edit, delete orders with item tracking
- ✅ **Dashboard Analytics** - Real-time KPIs and visualizations
- ✅ **AI-Powered Reports** - Generate optimization insights (mock AI for demo)
- ✅ **Smart Notifications** - Auto-alerts for low stock items
- ✅ **Data Import/Export** - CSV import and export functionality
- ✅ **User Preferences** - Dark mode, notifications, currency settings
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Modular Architecture** - Clean, maintainable codebase
- ✅ **Comprehensive Testing** - Unit, integration, and E2E test setup

## 🏗️ Architecture

### Modular Structure

```
src/
├── pages/              # Page-level components
├── features/          # Feature modules (notifications, etc.)
├── ui/                # Reusable UI component library
├── hooks/             # Custom React hooks
├── services/          # Modular business logic
│   ├── products/
│   ├── orders/
│   ├── customers/
│   └── preferences/
├── utils/             # Utility functions
│   ├── formatting.ts
│   ├── validation.ts
│   └── helpers.ts
├── types/             # TypeScript definitions
├── contexts/          # React contexts
├── lib/               # Third-party configs
└── test/              # Testing infrastructure
```

### Key Principles

- **Modular** - Each module < 100 lines, single responsibility
- **Testable** - Comprehensive test coverage
- **Type-Safe** - Full TypeScript support
- **Reusable** - Shared components and utilities
- **Maintainable** - Clear structure and documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account ([sign up free](https://supabase.com))

### Installation

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd stockflow-inventory
   npm install
   ```

2. **Set up Supabase:**
   - Create project at [supabase.com](https://app.supabase.com)
   - Run SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Enable OAuth providers (optional)
   - Get API keys from Settings → API

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   > [!WARNING]
   > **NEVER commit `.env.local` to git!** It contains sensitive credentials.
   > If credentials are accidentally exposed, rotate them immediately in Supabase dashboard.

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to `http://localhost:3000`


## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test:coverage
```

**Test Coverage:**
- Formatting utilities: ✅ 100%
- Validation utilities: ✅ 100%
- Services: ✅ Partial
- Hooks: ✅ Partial

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Testing:** Vitest, React Testing Library
- **Notifications:** React Hot Toast

## 📦 Project Stats

- **Total Files:** 58 TypeScript files
- **Total Lines:** ~4,700 lines of code
- **Build Size:** 976 KB (284 KB gzipped)
- **Test Coverage:** Growing (utilities at 100%)

## 🎯 Key Features in Detail

### Authentication
- Email/password authentication
- OAuth with Google and GitHub
- Session management
- Protected routes

### Inventory Management
- Add, edit, delete products
- Advanced search and filtering
- Category and status filters
- Price range filtering
- Stock level tracking
- Low stock alerts

### Order Management
- Create orders with multiple items
- Edit order status
- Delete orders
- Order history tracking

### Analytics & Reporting
- Real-time dashboard KPIs
- Revenue trends chart
- Category distribution
- AI-powered optimization reports (mock)

### Notifications
- Smart notification center
- Auto-detects low stock
- Real-time updates
- Mark as read/unread

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run type-check   # TypeScript type checking
```

### Code Organization

- **Components** → Feature-specific components
- **Pages** → Page-level wrappers
- **Features** → Self-contained feature modules
- **UI** → Reusable UI components
- **Hooks** → Custom React hooks
- **Services** → Business logic (modular)
- **Utils** → Utility functions
- **Types** → TypeScript definitions

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy to Vercel:**
```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## 🎨 UI Components

Reusable components available in `src/ui/components/`:
- `Button` - Variants, sizes, loading states
- `Input` - Form inputs with validation
- `Card` - Container component

## 🧩 Custom Hooks

Available hooks in `src/hooks/`:
- `useProducts` - Product data management
- `useOrders` - Order data management

## 📊 Database Schema

See `supabase/migrations/001_initial_schema.sql` for complete schema.

**Main Tables:**
- `products` - Inventory items
- `orders` - Customer orders
- `order_items` - Order line items
- `customers` - Customer information
- `user_preferences` - User settings

## 🔒 Security

### Authentication & Data Protection
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User data isolation via `user_id` filtering
- ✅ Supabase Auth with JWT tokens
- ✅ HTTPS enforced by default
- ✅ Session management and refresh tokens

### Environment Security
> [!CAUTION]
> **Critical Security Notes:**
> - `.env.local` is gitignored by default - **verify it's not committed**
> - `DATABASE_URL` contains credentials - only use server-side
> - `VITE_SUPABASE_ANON_KEY` is safe to expose (public anonymous key)
> - If credentials are exposed, rotate them immediately:
>   1. Go to Supabase Dashboard → Settings → API
>   2. Reset service role key (if exposed)
>   3. Update `.env.local` with new credentials

### Best Practices
- Never hardcode secrets in code
- Use environment variables for all sensitive data
- Enable RLS on all database tables
- Implement input validation on all user inputs
- Keep dependencies updated (run `npm audit` regularly)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License


---

**Built with ❤️ using React, TypeScript, and Supabase**

**Status:** 🟢 Production Ready
