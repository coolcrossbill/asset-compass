export interface Datacenter {
  id: string;
  name: string;
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Server {
  id: string;
  hostname: string;
  datacenterId: string;
  datacenterName?: string;
  model: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Host {
  id: string;
  hostname: string;
  serverId: string;
  serverHostname?: string;
  osId?: string;
  osName?: string;
  type: 'vm' | 'container' | 'bare-metal';
  status: 'running' | 'stopped' | 'suspended';
  cpu: number;
  memoryGb: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPAddress {
  id: string;
  address: string;
  hostId?: string;
  hostHostname?: string;
  type: 'ipv4' | 'ipv6';
  allocation: 'static' | 'dhcp' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

export interface OperatingSystem {
  id: string;
  name: string;
  version: string;
  vendor: string;
  eolDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  personId: string;
  personName?: string;
  entityType: 'datacenter' | 'server' | 'host' | 'ip';
  entityId: string;
  role: 'owner' | 'admin' | 'operator' | 'viewer';
  createdAt: string;
}

export type EntityType = 'datacenter' | 'server' | 'host' | 'ip' | 'os' | 'person';

export interface EntityCounts {
  datacenters: number;
  servers: number;
  hosts: number;
  ips: number;
  operatingSystems: number;
  persons: number;
}
