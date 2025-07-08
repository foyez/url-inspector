include backend/.env
export

## ===========
## BACKEND
## ===========

BE_DIR=backend
DOCKER_CMD= \
	docker compose -p dev \
	-f $(BE_DIR)/docker-compose.yaml \
	-f $(BE_DIR)/docker-compose.dev.yaml \
	run --rm
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
	$(DOCKER_CMD) migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)

## migrateup: apply all up migrations via Docker Compose
migrateup:
	@echo "🚀 applying all up migrations..."
	$(DOCKER_CMD) migrate -path=$(MIGRATIONS_PATH) -database="$(DB_SOURCE)" -verbose up

## migratedown: apply all down migrations via Docker Compose
migratedown:
	@echo "⏬ applying all down migrations..."
	$(DOCKER_CMD) migrate -path=$(MIGRATIONS_PATH) -database="$(DB_SOURCE)" -verbose down

## sqlc: generate Go code from SQL
sqlc:
	@echo "🔧 generating go code from SQL..."
	$(DOCKER_CMD) sqlc generate

seed:
	@echo "🌱 Seeding demo data into DB..."
	docker compose -p dev \
		-f ${BE_DIR}/docker-compose.yaml \
		-f ${BE_DIR}/docker-compose.dev.yaml \
		exec -T mysql mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${BE_DIR}/doc/seed.sql

## ===========
## FRONTEND
## ===========

FE_DIR=client

fe_install:
	cd $(FE_DIR) && npm i

fe_dev:
	cd $(FE_DIR) && npm run dev

fe_build:
	cd $(FE_DIR) && npm run build

fe_test:
	cd $(FE_DIR) && npm run test

.PHONY: \
	up up_dev down down_dev sqlc seed \
	create_migration migrateup migratedown \
	fe_install fe_dev fe_build fe_test