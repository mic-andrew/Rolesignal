.PHONY: setup start dev server client db-migrate db-reset lint test

setup:
	cd server && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
	cd client && npm install

start:
	@chmod +x ./scripts/start.sh && ./scripts/start.sh

dev:
	docker compose up -d
	@echo "PostgreSQL running on localhost:5432"
	@echo "Redis running on localhost:6379"
	@echo "Run 'make server' and 'make client' in separate terminals"

server:
	cd server && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

client:
	cd client && npm run dev

db-migrate:
	cd server && . .venv/bin/activate && alembic upgrade head

db-reset:
	cd server && . .venv/bin/activate && alembic downgrade base && alembic upgrade head

lint:
	cd server && . .venv/bin/activate && ruff check app/
	cd client && npm run lint

test:
	cd server && . .venv/bin/activate && pytest
	cd client && npm run test --if-present
