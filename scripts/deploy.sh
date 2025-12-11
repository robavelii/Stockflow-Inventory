#!/bin/bash
set -e

echo "🚀 Deploying StockFlow Inventory..."

# Build
echo "📦 Building application..."
npm run build

# Run migrations
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Running database migrations..."
    npm run db:migrate:deploy
else
    echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

echo "✅ Deployment preparation complete!"

