# Frontend-Backend Integration Guide

## Overview

The Asset Compass frontend is now fully connected to the FastAPI backend with automatic data fetching and real-time updates.

## What Was Done

### 1. Created API Client (`/src/lib/api.ts`)

- Base API client with fetch wrapper
- Automatic snake_case ↔ camelCase conversion
- Error handling with `ApiError` class
- Support for GET, POST, PUT, DELETE operations

### 2. Created API Services (`/src/services/api.ts`)

Service objects for all entities:
- `datacenterApi`
- `serverApi`
- `hostApi`
- `ipAddressApi`
- `osApi`
- `personApi`
- `assignmentApi`

Each service provides CRUD operations: `getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`

### 3. Updated Components

**Dashboard** (`/src/pages/Dashboard.tsx`)
- Fetches all entity counts from API
- Shows loading state
- Displays real-time statistics

**Datacenter List** (`/src/pages/datacenters/DatacenterList.tsx`)
- Fetches datacenters and servers from API
- Error handling with retry button
- Loading state

**Datacenter Detail** (`/src/pages/datacenters/DatacenterDetail.tsx`)
- Fetches single datacenter with related data
- Shows loading state
- Error handling

### 4. Type Safety

Updated `vite-env.d.ts` to include TypeScript definitions for environment variables.

## Running the Application

### Option 1: Docker Compose (Recommended)

```bash
cd app
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Backend API on port 8000
- Frontend app on port 3000

### Option 2: Development Mode

Terminal 1 - Backend:
```bash
cd app/backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```bash
cd app
npm install
npm run dev
```

## API URL Configuration

The frontend uses `VITE_API_URL` environment variable:

- **Default**: `http://localhost:8000`
- **Docker**: Automatically set in docker-compose.yml
- **Custom**: Set in `.env` file (create from `.env.example`)

## Data Flow

```
Frontend Component
    ↓ (useState, useEffect)
API Service (/services/api.ts)
    ↓ (datacenterApi.getAll())
API Client (/lib/api.ts)
    ↓ (fetch + transformations)
Backend API (http://localhost:8000)
    ↓
PostgreSQL Database
```

## Next Steps

To update other pages (servers, hosts, IPs, etc.), follow the same pattern:

1. Import the appropriate API service
2. Add `useState` for data and loading states
3. Use `useEffect` to fetch data on component mount
4. Handle loading and error states
5. Replace mock data imports with state variables

Example pattern:
```typescript
import { useState, useEffect } from 'react';
import { serverApi } from '@/services/api';

export default function ServerList() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await serverApi.getAll();
        setServers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ... rest of component
}
```

## Testing

1. Start the services:
   ```bash
   docker-compose up -d
   ```

2. Check backend API: http://localhost:8000/docs

3. Check frontend: http://localhost:3000

4. Verify data is loading from the backend (check Network tab in browser DevTools)

## Troubleshooting

**CORS errors:**
- Backend already has CORS configured for `localhost:3000` and `localhost:8080`

**Connection refused:**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` is set correctly

**Data not updating:**
- Check browser console for errors
- Verify API endpoints return data: http://localhost:8000/api/datacenters

