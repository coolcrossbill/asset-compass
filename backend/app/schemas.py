from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models import ServerStatus, HostType, HostStatus, IPType, IPAllocation, EntityType, AssignmentRole

# Datacenter schemas
class DatacenterBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = None

class DatacenterCreate(DatacenterBase):
    pass

class Datacenter(DatacenterBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Server schemas
class ServerBase(BaseModel):
    hostname: str
    datacenter_id: str
    model: str
    serial_number: str
    status: ServerStatus

class ServerCreate(ServerBase):
    pass

class Server(ServerBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Operating System schemas
class OperatingSystemBase(BaseModel):
    name: str
    version: str
    vendor: str
    eol_date: Optional[str] = None

class OperatingSystemCreate(OperatingSystemBase):
    pass

class OperatingSystem(OperatingSystemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Host schemas
class HostBase(BaseModel):
    hostname: str
    server_id: str
    os_id: Optional[str] = None
    type: HostType
    status: HostStatus
    cpu: int
    memory_gb: int

class HostCreate(HostBase):
    pass

class Host(HostBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# IP Address schemas
class IPAddressBase(BaseModel):
    address: str
    host_id: Optional[str] = None
    type: IPType
    allocation: IPAllocation

class IPAddressCreate(IPAddressBase):
    pass

class IPAddress(IPAddressBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Person schemas
class PersonBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: str
    phone: Optional[str] = None

class PersonCreate(PersonBase):
    pass

class Person(PersonBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Assignment schemas
class AssignmentBase(BaseModel):
    person_id: str
    entity_type: EntityType
    entity_id: str
    role: AssignmentRole

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

