# Asset Compass Backend

FastAPI backend for the Asset Compass application.

## Setup

The backend is configured to run via Docker Compose. See the main `docker-compose.yml` in the `app/` directory.

## API Endpoints

- `/api/datacenters` - Datacenter management
- `/api/servers` - Server management
- `/api/hosts` - Host management
- `/api/ip-addresses` - IP address management
- `/api/operating-systems` - Operating system management
- `/api/persons` - Person management
- `/api/assignments` - Assignment management

## Database Migrations

Migrations are handled by Alembic and run automatically when the container starts.

- `001_initial_schema.py` - Creates all database tables
- `002_seed_mock_data.py` - Seeds the database with mock data

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (default: `postgresql://assetcompass:assetcompass@postgres:5432/assetcompass`)

