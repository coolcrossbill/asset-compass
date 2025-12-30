from sqlalchemy import Column, String, ForeignKey, Integer, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class ServerStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    maintenance = "maintenance"

class HostType(str, enum.Enum):
    vm = "vm"
    container = "container"
    bare_metal = "bare-metal"  # Database uses bare-metal, Python attribute uses bare_metal

class HostStatus(str, enum.Enum):
    running = "running"
    stopped = "stopped"
    suspended = "suspended"

class IPType(str, enum.Enum):
    ipv4 = "ipv4"
    ipv6 = "ipv6"

class IPAllocation(str, enum.Enum):
    static = "static"
    dhcp = "dhcp"
    reserved = "reserved"

class EntityType(str, enum.Enum):
    datacenter = "datacenter"
    server = "server"
    host = "host"
    ip = "ip"

class AssignmentRole(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    operator = "operator"
    viewer = "viewer"

class Datacenter(Base):
    __tablename__ = "datacenters"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    servers = relationship("Server", back_populates="datacenter")

class Server(Base):
    __tablename__ = "servers"

    id = Column(String, primary_key=True)
    hostname = Column(String, nullable=False)
    datacenter_id = Column(String, ForeignKey("datacenters.id"), nullable=False)
    model = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    status = Column(SQLEnum(ServerStatus), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    datacenter = relationship("Datacenter", back_populates="servers")
    hosts = relationship("Host", back_populates="server")

class OperatingSystem(Base):
    __tablename__ = "operating_systems"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    vendor = Column(String, nullable=False)
    eol_date = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    hosts = relationship("Host", back_populates="operating_system")

class Host(Base):
    __tablename__ = "hosts"

    id = Column(String, primary_key=True)
    hostname = Column(String, nullable=False)
    server_id = Column(String, ForeignKey("servers.id"), nullable=False)
    os_id = Column(String, ForeignKey("operating_systems.id"), nullable=True)
    type = Column(SQLEnum(HostType), nullable=False)
    status = Column(SQLEnum(HostStatus), nullable=False)
    cpu = Column(Integer, nullable=False)
    memory_gb = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    server = relationship("Server", back_populates="hosts")
    operating_system = relationship("OperatingSystem", back_populates="hosts")
    ip_addresses = relationship("IPAddress", back_populates="host")

class IPAddress(Base):
    __tablename__ = "ip_addresses"

    id = Column(String, primary_key=True)
    address = Column(String, nullable=False, unique=True)
    host_id = Column(String, ForeignKey("hosts.id"), nullable=True)
    type = Column(SQLEnum(IPType), nullable=False)
    allocation = Column(SQLEnum(IPAllocation), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    host = relationship("Host", back_populates="ip_addresses")

class Person(Base):
    __tablename__ = "persons"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, nullable=False)
    department = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    assignments = relationship("Assignment", back_populates="person")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True)
    person_id = Column(String, ForeignKey("persons.id"), nullable=False)
    entity_type = Column(SQLEnum(EntityType), nullable=False)
    entity_id = Column(String, nullable=False)
    role = Column(SQLEnum(AssignmentRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    person = relationship("Person", back_populates="assignments")

