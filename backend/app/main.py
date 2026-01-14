from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import datacenters, servers, hosts, ip_addresses, operating_systems, persons, assignments
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Asset Compass API", version="1.0.0")

# Configure CORS
# Support both explicit origins and regex patterns via environment variables
cors_origins = os.getenv("CORS_ORIGINS")
cors_origin_regex = os.getenv("CORS_ORIGIN_REGEX")

# Build CORS configuration
cors_kwargs = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if cors_origins:
    # Use explicit origins if provided (comma-separated)
    cors_kwargs["allow_origins"] = [origin.strip() for origin in cors_origins.split(",")]
elif cors_origin_regex:
    # Use custom regex if provided
    cors_kwargs["allow_origin_regex"] = cors_origin_regex
else:
    # Default: Allow same-domain, different-port requests (localhost or 127.0.0.1 with any port)
    cors_kwargs["allow_origin_regex"] = r"http://(localhost|127\.0\.0\.1):\d+"

app.add_middleware(CORSMiddleware, **cors_kwargs)

# Include routers
app.include_router(datacenters.router, prefix="/api/datacenters", tags=["datacenters"])
app.include_router(servers.router, prefix="/api/servers", tags=["servers"])
app.include_router(hosts.router, prefix="/api/hosts", tags=["hosts"])
app.include_router(ip_addresses.router, prefix="/api/ip-addresses", tags=["ip-addresses"])
app.include_router(operating_systems.router, prefix="/api/operating-systems", tags=["operating-systems"])
app.include_router(persons.router, prefix="/api/persons", tags=["persons"])
app.include_router(assignments.router, prefix="/api/assignments", tags=["assignments"])

@app.get("/")
async def root():
    return {"message": "Asset Compass API"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

