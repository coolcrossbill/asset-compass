"""Seed mock data

Revision ID: 002
Revises: 001
Create Date: 2024-12-01 12:01:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Insert datacenters (only if they don't exist)
    op.execute("""
        INSERT INTO datacenters (id, name, location, description, created_at, updated_at) 
        VALUES
        ('dc-1', 'DC-East-01', 'New York, NY', 'Primary East Coast datacenter', '2024-01-15', '2024-12-01'),
        ('dc-2', 'DC-West-01', 'San Francisco, CA', 'Primary West Coast datacenter', '2024-02-20', '2024-11-15'),
        ('dc-3', 'DC-Central-01', 'Chicago, IL', 'Central US datacenter', '2024-03-10', '2024-10-20')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert operating systems (only if they don't exist)
    op.execute("""
        INSERT INTO operating_systems (id, name, version, vendor, eol_date, created_at, updated_at) 
        VALUES
        ('os-1', 'Ubuntu Server', '22.04 LTS', 'Canonical', '2027-04-01', '2024-01-01', '2024-01-01'),
        ('os-2', 'RHEL', '9.3', 'Red Hat', '2032-05-31', '2024-01-01', '2024-01-01'),
        ('os-3', 'Windows Server', '2022', 'Microsoft', '2031-10-14', '2024-01-01', '2024-01-01'),
        ('os-4', 'Debian', '12', 'Debian Project', '2028-06-01', '2024-01-01', '2024-01-01'),
        ('os-5', 'CentOS Stream', '9', 'Red Hat', NULL, '2024-01-01', '2024-01-01')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert servers (only if they don't exist)
    op.execute("""
        INSERT INTO servers (id, hostname, datacenter_id, model, serial_number, status, created_at, updated_at) 
        VALUES
        ('srv-1', 'srv-nyc-prod-01', 'dc-1', 'Dell PowerEdge R750', 'DL7500001', 'online', '2024-01-20', '2024-12-01'),
        ('srv-2', 'srv-nyc-prod-02', 'dc-1', 'Dell PowerEdge R750', 'DL7500002', 'online', '2024-01-20', '2024-12-01'),
        ('srv-3', 'srv-sfo-prod-01', 'dc-2', 'HPE ProLiant DL380', 'HP3800001', 'online', '2024-02-25', '2024-11-15'),
        ('srv-4', 'srv-chi-dev-01', 'dc-3', 'Supermicro X12', 'SM1200001', 'maintenance', '2024-03-15', '2024-12-10'),
        ('srv-5', 'srv-nyc-db-01', 'dc-1', 'Dell PowerEdge R750', 'DL7500003', 'online', '2024-04-01', '2024-12-01')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert hosts (only if they don't exist)
    op.execute("""
        INSERT INTO hosts (id, hostname, server_id, os_id, type, status, cpu, memory_gb, created_at, updated_at) 
        VALUES
        ('host-1', 'web-prod-01', 'srv-1', 'os-1', 'vm', 'running', 4, 16, '2024-02-01', '2024-12-01'),
        ('host-2', 'web-prod-02', 'srv-1', 'os-1', 'vm', 'running', 4, 16, '2024-02-01', '2024-12-01'),
        ('host-3', 'api-prod-01', 'srv-2', 'os-2', 'vm', 'running', 8, 32, '2024-02-15', '2024-12-01'),
        ('host-4', 'db-prod-01', 'srv-5', 'os-2', 'vm', 'running', 16, 64, '2024-04-10', '2024-12-01'),
        ('host-5', 'cache-prod-01', 'srv-3', 'os-4', 'container', 'running', 2, 8, '2024-03-01', '2024-11-15'),
        ('host-6', 'dev-env-01', 'srv-4', 'os-1', 'vm', 'stopped', 4, 8, '2024-03-20', '2024-12-10')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert IP addresses (only if they don't exist)
    op.execute("""
        INSERT INTO ip_addresses (id, address, host_id, type, allocation, created_at, updated_at) 
        VALUES
        ('ip-1', '10.1.1.10', 'host-1', 'ipv4', 'static', '2024-02-01', '2024-02-01'),
        ('ip-2', '10.1.1.11', 'host-2', 'ipv4', 'static', '2024-02-01', '2024-02-01'),
        ('ip-3', '10.1.2.20', 'host-3', 'ipv4', 'static', '2024-02-15', '2024-02-15'),
        ('ip-4', '10.1.3.30', 'host-4', 'ipv4', 'static', '2024-04-10', '2024-04-10'),
        ('ip-5', '10.2.1.10', 'host-5', 'ipv4', 'static', '2024-03-01', '2024-03-01'),
        ('ip-6', '10.3.1.10', 'host-6', 'ipv4', 'dhcp', '2024-03-20', '2024-03-20'),
        ('ip-7', '10.1.1.100', NULL, 'ipv4', 'reserved', '2024-01-01', '2024-01-01'),
        ('ip-8', '10.1.1.101', NULL, 'ipv4', 'reserved', '2024-01-01', '2024-01-01')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert persons (only if they don't exist)
    op.execute("""
        INSERT INTO persons (id, name, email, role, department, phone, created_at, updated_at) 
        VALUES
        ('per-1', 'John Smith', 'john.smith@company.com', 'Systems Administrator', 'IT Operations', '+1-555-0101', '2024-01-01', '2024-01-01'),
        ('per-2', 'Sarah Johnson', 'sarah.johnson@company.com', 'Network Engineer', 'IT Operations', '+1-555-0102', '2024-01-01', '2024-01-01'),
        ('per-3', 'Mike Chen', 'mike.chen@company.com', 'DevOps Engineer', 'Engineering', '+1-555-0103', '2024-01-01', '2024-01-01'),
        ('per-4', 'Emily Davis', 'emily.davis@company.com', 'Database Administrator', 'IT Operations', NULL, '2024-01-01', '2024-01-01'),
        ('per-5', 'Alex Turner', 'alex.turner@company.com', 'Security Engineer', 'Security', '+1-555-0105', '2024-01-01', '2024-01-01')
        ON CONFLICT (id) DO NOTHING;
    """)
    
    # Insert assignments (only if they don't exist)
    op.execute("""
        INSERT INTO assignments (id, person_id, entity_type, entity_id, role, created_at) 
        VALUES
        ('assign-1', 'per-1', 'datacenter', 'dc-1', 'admin', '2024-01-15'),
        ('assign-2', 'per-2', 'datacenter', 'dc-2', 'admin', '2024-02-20'),
        ('assign-3', 'per-3', 'server', 'srv-1', 'operator', '2024-01-20'),
        ('assign-4', 'per-4', 'host', 'host-4', 'owner', '2024-04-10'),
        ('assign-5', 'per-5', 'datacenter', 'dc-1', 'viewer', '2024-01-15')
        ON CONFLICT (id) DO NOTHING;
    """)


def downgrade() -> None:
    op.execute("DELETE FROM assignments")
    op.execute("DELETE FROM persons")
    op.execute("DELETE FROM ip_addresses")
    op.execute("DELETE FROM hosts")
    op.execute("DELETE FROM servers")
    op.execute("DELETE FROM operating_systems")
    op.execute("DELETE FROM datacenters")

