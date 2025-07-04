include backend/.env

## ===========
## BACKEND
## ===========

BE_DIR=backend
MIGRATE_CMD= \
	docker compose -p dev \
	-f $(BE_DIR)/docker-compose.yaml \
	-f $(BE_DIR)/docker-compose.dev.yaml \
	run --rm migrate
MIGRATIONS_PATH=/migrations

## up_dev: up docker containers for development
up_dev:
	@echo "📦 upping docker containers for development..."
	docker compose -p dev -f ${BE_DIR}/docker-compose.yaml -f ${BE_DIR}/docker-compose.dev.yaml up --build

## up: up docker containers (prod)
up:
	@echo "📦 upping docker containers..."
	docker compose -p prod -f ${BE_DIR}/docker-compose.yaml up --build

## down_dev: remove docker containers for development
down_dev:
	@echo "🧹 removing docker containers for development..."
	docker compose -p dev -f ${BE_DIR}/docker-compose.yaml -f ${BE_DIR}/docker-compose.dev.yaml down

## down: remove docker containers (prod)
down:
	@echo "🧹 removing docker containers..."
	docker compose -p prod -f ${BE_DIR}/docker-compose.yaml down

## create_migration: create migration up & down files
create_migration:
	@if [ -z "$(name)" ]; then \
		echo "❌ Usage: make create_migration name=schema_name"; \
		exit 1; \
	fi
	@echo "creating migration files..."
	@mkdir -p db
	$(MIGRATE_CMD) create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)

## migrateup: apply all up migrations via Docker Compose
migrateup:
	@echo "🚀 applying all up migrations..."
	$(MIGRATE_CMD) -path=$(MIGRATIONS_PATH) -database="$(DB_SOURCE)" -verbose up

## migratedown: apply all down migrations via Docker Compose
migratedown:
	@echo "⏬ applying all down migrations..."
	$(MIGRATE_CMD) -path=$(MIGRATIONS_PATH) -database="$(DB_SOURCE)" -verbose down

## ===========
## FRONTEND
## ===========

fe_install:
	cd client && npm i

fe_dev:
	cd client && npm run dev

fe_build:
	cd client && npm run build

fe_test:
	cd client && npm run test

.PHONY: \
	create_migration migrateup migratedown \
	up up_dev down down_dev \
	fe_install fe_dev fe_build fe_test