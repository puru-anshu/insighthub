# InsightHub - Development Commands

.PHONY: help dev backend frontend build clean

JAVA_HOME ?= /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

backend: ## Run backend (Spring Boot)
	cd backend && JAVA_HOME=$(JAVA_HOME) mvn spring-boot:run

frontend: ## Run frontend (Vite dev server)
	cd frontend && pnpm dev

install: ## Install frontend dependencies
	cd frontend && pnpm install

build-backend: ## Build backend JAR
	cd backend && JAVA_HOME=$(JAVA_HOME) mvn clean package -DskipTests

build-frontend: ## Build frontend for production
	cd frontend && pnpm build

build: build-backend build-frontend ## Build both

clean: ## Clean build artifacts
	cd backend && mvn clean
	cd frontend && rm -rf dist node_modules/.vite

lint: ## Lint frontend code
	cd frontend && pnpm lint

test-backend: ## Run backend tests
	cd backend && JAVA_HOME=$(JAVA_HOME) mvn test

test-frontend: ## Run frontend tests
	cd frontend && pnpm test
