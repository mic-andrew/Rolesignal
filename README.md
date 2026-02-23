# RoleSignal

Monorepo: `server/` (FastAPI) and `client/` (React + TypeScript).

## Quick Start

```bash
# Install all dependencies
make setup

# Start PostgreSQL + Redis
make dev

# In one terminal: start the API server
make server

# In another terminal: start the frontend
make client
```

## Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0 async, PostgreSQL, Alembic, Redis
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Query, Zustand, React Router v7

## Commands

| Command | Description |
|---|---|
| `make setup` | Create Python venv, install deps, run npm install |
| `make dev` | Start PostgreSQL + Redis via Docker |
| `make server` | Run FastAPI dev server (port 8000) |
| `make client` | Run Vite dev server (port 5173) |
| `make db-migrate` | Apply Alembic migrations |
| `make db-reset` | Reset database and re-run migrations |
| `make lint` | Lint backend (ruff) and frontend (eslint) |
| `make test` | Run all tests |

## Environment

Copy `server/.env.example` to `server/.env` and fill in values.
Copy `client/.env.example` to `client/.env` and fill in values.
