.PHONY: help install dev build test docker-build docker-up docker-down migrate seed clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

test: ## Run tests
	npm test

test-coverage: ## Run tests with coverage
	npm run test:coverage

db-generate: ## Generate Prisma client
	npm run db:generate

db-migrate: ## Run database migrations
	npm run db:migrate

db-migrate-deploy: ## Deploy migrations (production)
	npm run db:migrate:deploy

db-seed: ## Seed database
	npm run db:seed

db-studio: ## Open Prisma Studio
	npm run db:studio

db-reset: ## Reset database (WARNING: deletes all data)
	npm run db:reset

docker-build: ## Build Docker image
	docker build -t stockflow-inventory:latest .

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

clean: ## Clean build artifacts
	rm -rf dist node_modules/.vite

setup: install db-generate ## Initial setup
	@echo "✅ Setup complete! Add your DATABASE_URL to .env.local"

