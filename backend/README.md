# Asset Compass Backend

FastAPI backend for the Asset Compass application.

## Setup

The backend is configured to run via Docker Compose. See the main `docker-compose.yml` in the `app/` directory.

### Dockerfile Options

Multiple Dockerfile variants are available for different environments:

- **`Dockerfile`** (Default) - Multi-distro support (Debian/Ubuntu/Alpine), Python 3.11, ~180 MB
- **`Dockerfile.ubuntu24`** - Ubuntu 24.04 specific, Python 3.12, ~250 MB

See [DOCKERFILE_OPTIONS.md](./DOCKERFILE_OPTIONS.md) for detailed comparison and usage guide.

To use the Ubuntu 24.04 variant:
```bash
docker-compose -f docker-compose.ubuntu24.yml up
```

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

