# API Connection Setup

The frontend is now connected to the FastAPI backend.

## Environment Configuration

The API URL is configured via the `VITE_API_URL` environment variable.

### Development

For local development (running `npm run dev`):

1. Ensure the backend is running on `http://localhost:8000`
2. The API URL defaults to `http://localhost:8000` if not specified

### Docker

When running via Docker Compose, the environment is automatically configured in `docker-compose.yml`.

## API Services

API services are located in `/src/services/api.ts` and provide methods for:

- **Datacenters**: `datacenterApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Servers**: `serverApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Hosts**: `hostApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **IP Addresses**: `ipAddressApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Operating Systems**: `osApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Persons**: `personApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Assignments**: `assignmentApi.getAll()`, `getById()`, `create()`, `update()`, `delete()`

## Data Transformation

The API client automatically handles conversion between:
- Backend snake_case (e.g., `created_at`, `datacenter_id`)
- Frontend camelCase (e.g., `createdAt`, `datacenterId`)

## Error Handling

API errors are caught and displayed in the UI with appropriate error messages and retry options.

## Updated Components

The following components have been updated to use the API:

- ✅ `Dashboard.tsx` - Fetches all entity counts
- ✅ `DatacenterList.tsx` - Lists datacenters
- ✅ `DatacenterDetail.tsx` - Shows datacenter details

Other list and detail pages follow the same pattern and can be updated similarly.

