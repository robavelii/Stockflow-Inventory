#!/bin/bash
set -e

echo "🚀 Setting up StockFlow Inventory..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate || echo "⚠️  Prisma generation failed. Make sure DATABASE_URL is set in .env.local"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run 'npm run db:migrate' to apply database migrations"
echo "3. Run 'npm run db:seed' to seed the database (optional)"
echo "4. Run 'npm run dev' to start development server"

