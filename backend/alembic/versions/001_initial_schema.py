"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-12-01 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create datacenters table
    op.create_table(
        'datacenters',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create operating_systems table
    op.create_table(
        'operating_systems',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('version', sa.String(), nullable=False),
        sa.Column('vendor', sa.String(), nullable=False),
        sa.Column('eol_date', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create servers table
    op.create_table(
        'servers',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('hostname', sa.String(), nullable=False),
        sa.Column('datacenter_id', sa.String(), nullable=False),
        sa.Column('model', sa.String(), nullable=False),
        sa.Column('serial_number', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('online', 'offline', 'maintenance', name='serverstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['datacenter_id'], ['datacenters.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create hosts table
    op.create_table(
        'hosts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('hostname', sa.String(), nullable=False),
        sa.Column('server_id', sa.String(), nullable=False),
        sa.Column('os_id', sa.String(), nullable=True),
        sa.Column('type', sa.Enum('vm', 'container', 'bare-metal', name='hosttype'), nullable=False),
        sa.Column('status', sa.Enum('running', 'stopped', 'suspended', name='hoststatus'), nullable=False),
        sa.Column('cpu', sa.Integer(), nullable=False),
        sa.Column('memory_gb', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['os_id'], ['operating_systems.id'], ),
        sa.ForeignKeyConstraint(['server_id'], ['servers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create ip_addresses table
    op.create_table(
        'ip_addresses',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('address', sa.String(), nullable=False),
        sa.Column('host_id', sa.String(), nullable=True),
        sa.Column('type', sa.Enum('ipv4', 'ipv6', name='iptype'), nullable=False),
        sa.Column('allocation', sa.Enum('static', 'dhcp', 'reserved', name='ipallocation'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['host_id'], ['hosts.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('address')
    )
    
    # Create persons table
    op.create_table(
        'persons',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('department', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # Create assignments table
    op.create_table(
        'assignments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('person_id', sa.String(), nullable=False),
        sa.Column('entity_type', sa.Enum('datacenter', 'server', 'host', 'ip', name='entitytype'), nullable=False),
        sa.Column('entity_id', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('owner', 'admin', 'operator', 'viewer', name='assignmentrole'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['person_id'], ['persons.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('assignments')
    op.drop_table('persons')
    op.drop_table('ip_addresses')
    op.drop_table('hosts')
    op.drop_table('servers')
    op.drop_table('operating_systems')
    op.drop_table('datacenters')
    
    # Drop enums
    sa.Enum(name='assignmentrole').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='entitytype').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='ipallocation').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='iptype').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='hoststatus').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='hosttype').drop(op.get_bind(), checkfirst=True)
    sa.Enum(name='serverstatus').drop(op.get_bind(), checkfirst=True)

