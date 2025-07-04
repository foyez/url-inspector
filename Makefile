## ===========
## BACKEND
## ===========

BE_DIR=backend

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

## ===========
## FRONTEND
## ===========

fe-install:
	cd client && npm i

fe-dev:
	cd client && npm run dev

fe-build:
	cd client && npm run build

fe-test:
	cd client && npm run test

.PHONY: \
	create_migration migrateup migratedown \
	up up_dev down down_dev