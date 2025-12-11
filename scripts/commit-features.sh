#!/bin/bash

# Sequential Feature Commit Script
# This script commits project features sequentially to create a meaningful git history

set -e

cd "$(dirname "$0")/.."

echo "Starting sequential feature commits..."

# Configure git if needed
git config user.email "${GIT_EMAIL:-dev@stockflow.local}"
git config user.name "${GIT_NAME:-StockFlow Developer}"

# 1. Project Setup & Configuration
git add package.json package-lock.json bun.lock tsconfig.json vite.config.ts vitest.config.ts 2>/dev/null || true
git add postcss.config.js tailwind.config.js .eslintrc.cjs .eslintrc.json .prettierrc 2>/dev/null || true
git add index.html metadata.json 2>/dev/null || true
git commit -m "feat: initialize project configuration and dependencies" --allow-empty 2>/dev/null || echo "Skipped: project config"

# 2. Docker & CI/CD Setup
git add Dockerfile Dockerfile.dev docker-compose.yml docker-compose.dev.yml .dockerignore Makefile 2>/dev/null || true
git add .github/ 2>/dev/null || true
git commit -m "feat: add Docker and CI/CD configuration" --allow-empty 2>/dev/null || echo "Skipped: docker setup"

# 3. Database Schema & Migrations
git add prisma/ prisma.config.ts supabase/ 2>/dev/null || true
git commit -m "feat: add database schema and migrations (Prisma + Supabase)" --allow-empty 2>/dev/null || echo "Skipped: database schema"

# 4. Core Types & Schemas
git add src/types/ src/schemas/ 2>/dev/null || true
git commit -m "feat: add TypeScript types and validation schemas" --allow-empty 2>/dev/null || echo "Skipped: types/schemas"

# 5. Utilities & Helpers
git add src/utils/ src/lib/ 2>/dev/null || true
git commit -m "feat: add utility functions and library helpers" --allow-empty 2>/dev/null || echo "Skipped: utilities"

# 6. Services Layer
git add src/services/products/ 2>/dev/null || true
git commit -m "feat: add product service layer" --allow-empty 2>/dev/null || echo "Skipped: product service"

git add src/services/customers/ 2>/dev/null || true
git commit -m "feat: add customer service layer" --allow-empty 2>/dev/null || echo "Skipped: customer service"

git add src/services/orders/ 2>/dev/null || true
git commit -m "feat: add order service layer" --allow-empty 2>/dev/null || echo "Skipped: order service"

git add src/services/preferences/ 2>/dev/null || true
git commit -m "feat: add user preferences service" --allow-empty 2>/dev/null || echo "Skipped: preferences service"

# 7. React Contexts
git add src/contexts/ 2>/dev/null || true
git commit -m "feat: add React context providers (auth, state management)" --allow-empty 2>/dev/null || echo "Skipped: contexts"

# 8. Custom Hooks
git add src/hooks/ 2>/dev/null || true
git commit -m "feat: add custom React hooks" --allow-empty 2>/dev/null || echo "Skipped: hooks"

# 9. UI Components
git add src/ui/ 2>/dev/null || true
git commit -m "feat: add reusable UI component library" --allow-empty 2>/dev/null || echo "Skipped: UI components"

# 10. Feature Components
git add src/components/Sidebar.tsx src/components/Header.tsx src/components/Layout.tsx 2>/dev/null || true
git commit -m "feat: add layout components (Sidebar, Header)" --allow-empty 2>/dev/null || echo "Skipped: layout components"

git add src/components/ProductModal.tsx src/components/InventoryList.tsx 2>/dev/null || true
git commit -m "feat: add inventory management components" --allow-empty 2>/dev/null || echo "Skipped: inventory components"

git add src/components/Settings.tsx src/components/DataManager.tsx 2>/dev/null || true
git commit -m "feat: add settings and data management components" --allow-empty 2>/dev/null || echo "Skipped: settings components"

git add src/components/ 2>/dev/null || true
git commit -m "feat: add remaining feature components" --allow-empty 2>/dev/null || echo "Skipped: remaining components"

# 11. Features (modular features)
git add src/features/notifications/ 2>/dev/null || true
git commit -m "feat: add notifications feature module" --allow-empty 2>/dev/null || echo "Skipped: notifications feature"

git add src/features/ 2>/dev/null || true
git commit -m "feat: add additional feature modules" --allow-empty 2>/dev/null || echo "Skipped: features"

# 12. Pages
git add src/pages/InventoryPage.tsx 2>/dev/null || true
git commit -m "feat: add inventory management page" --allow-empty 2>/dev/null || echo "Skipped: inventory page"

git add src/pages/ 2>/dev/null || true
git commit -m "feat: add application pages" --allow-empty 2>/dev/null || echo "Skipped: pages"

# 13. Router Configuration
git add src/router/ 2>/dev/null || true
git commit -m "feat: add React Router configuration" --allow-empty 2>/dev/null || echo "Skipped: router"

# 14. Main App Entry
git add src/App.tsx src/main.tsx src/index.css src/vite-env.d.ts 2>/dev/null || true
git commit -m "feat: add main application entry point and styles" --allow-empty 2>/dev/null || echo "Skipped: app entry"

# 15. Tests
git add src/test/ 2>/dev/null || true
git commit -m "test: add unit and integration tests" --allow-empty 2>/dev/null || echo "Skipped: tests"

# 16. Scripts
git add scripts/ 2>/dev/null || true
git commit -m "chore: add utility scripts" --allow-empty 2>/dev/null || echo "Skipped: scripts"

# 17. Documentation
git add README.md ARCHITECTURE.md 2>/dev/null || true
git commit -m "docs: add project documentation" --allow-empty 2>/dev/null || echo "Skipped: documentation"

# 18. Environment & Git Configuration
git add .env.example .gitignore 2>/dev/null || true
git commit -m "chore: add environment configuration and gitignore" --allow-empty 2>/dev/null || echo "Skipped: env config"

# 19. Any remaining files
git add -A 2>/dev/null || true
git commit -m "chore: add remaining project files" --allow-empty 2>/dev/null || echo "Skipped: remaining files"

echo ""
echo "✅ Sequential commits completed!"
echo ""
echo "Git history:"
git log --oneline | head -25
