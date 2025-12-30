from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import datacenters, servers, hosts, ip_addresses, operating_systems, persons, assignments

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Asset Compass API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

