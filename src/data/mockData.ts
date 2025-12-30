import { Datacenter, Server, Host, IPAddress, OperatingSystem, Person, Assignment } from '@/types/cmdb';

export const datacenters: Datacenter[] = [
  { id: 'dc-1', name: 'DC-East-01', location: 'New York, NY', description: 'Primary East Coast datacenter', createdAt: '2024-01-15', updatedAt: '2024-12-01' },
  { id: 'dc-2', name: 'DC-West-01', location: 'San Francisco, CA', description: 'Primary West Coast datacenter', createdAt: '2024-02-20', updatedAt: '2024-11-15' },
  { id: 'dc-3', name: 'DC-Central-01', location: 'Chicago, IL', description: 'Central US datacenter', createdAt: '2024-03-10', updatedAt: '2024-10-20' },
];

export const servers: Server[] = [
  { id: 'srv-1', hostname: 'srv-nyc-prod-01', datacenterId: 'dc-1', datacenterName: 'DC-East-01', model: 'Dell PowerEdge R750', serialNumber: 'DL7500001', status: 'online', createdAt: '2024-01-20', updatedAt: '2024-12-01' },
  { id: 'srv-2', hostname: 'srv-nyc-prod-02', datacenterId: 'dc-1', datacenterName: 'DC-East-01', model: 'Dell PowerEdge R750', serialNumber: 'DL7500002', status: 'online', createdAt: '2024-01-20', updatedAt: '2024-12-01' },
  { id: 'srv-3', hostname: 'srv-sfo-prod-01', datacenterId: 'dc-2', datacenterName: 'DC-West-01', model: 'HPE ProLiant DL380', serialNumber: 'HP3800001', status: 'online', createdAt: '2024-02-25', updatedAt: '2024-11-15' },
  { id: 'srv-4', hostname: 'srv-chi-dev-01', datacenterId: 'dc-3', datacenterName: 'DC-Central-01', model: 'Supermicro X12', serialNumber: 'SM1200001', status: 'maintenance', createdAt: '2024-03-15', updatedAt: '2024-12-10' },
  { id: 'srv-5', hostname: 'srv-nyc-db-01', datacenterId: 'dc-1', datacenterName: 'DC-East-01', model: 'Dell PowerEdge R750', serialNumber: 'DL7500003', status: 'online', createdAt: '2024-04-01', updatedAt: '2024-12-01' },
];

export const operatingSystems: OperatingSystem[] = [
  { id: 'os-1', name: 'Ubuntu Server', version: '22.04 LTS', vendor: 'Canonical', eolDate: '2027-04-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'os-2', name: 'RHEL', version: '9.3', vendor: 'Red Hat', eolDate: '2032-05-31', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'os-3', name: 'Windows Server', version: '2022', vendor: 'Microsoft', eolDate: '2031-10-14', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'os-4', name: 'Debian', version: '12', vendor: 'Debian Project', eolDate: '2028-06-01', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'os-5', name: 'CentOS Stream', version: '9', vendor: 'Red Hat', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const hosts: Host[] = [
  { id: 'host-1', hostname: 'web-prod-01', serverId: 'srv-1', serverHostname: 'srv-nyc-prod-01', osId: 'os-1', osName: 'Ubuntu Server 22.04 LTS', type: 'vm', status: 'running', cpu: 4, memoryGb: 16, createdAt: '2024-02-01', updatedAt: '2024-12-01' },
  { id: 'host-2', hostname: 'web-prod-02', serverId: 'srv-1', serverHostname: 'srv-nyc-prod-01', osId: 'os-1', osName: 'Ubuntu Server 22.04 LTS', type: 'vm', status: 'running', cpu: 4, memoryGb: 16, createdAt: '2024-02-01', updatedAt: '2024-12-01' },
  { id: 'host-3', hostname: 'api-prod-01', serverId: 'srv-2', serverHostname: 'srv-nyc-prod-02', osId: 'os-2', osName: 'RHEL 9.3', type: 'vm', status: 'running', cpu: 8, memoryGb: 32, createdAt: '2024-02-15', updatedAt: '2024-12-01' },
  { id: 'host-4', hostname: 'db-prod-01', serverId: 'srv-5', serverHostname: 'srv-nyc-db-01', osId: 'os-2', osName: 'RHEL 9.3', type: 'vm', status: 'running', cpu: 16, memoryGb: 64, createdAt: '2024-04-10', updatedAt: '2024-12-01' },
  { id: 'host-5', hostname: 'cache-prod-01', serverId: 'srv-3', serverHostname: 'srv-sfo-prod-01', osId: 'os-4', osName: 'Debian 12', type: 'container', status: 'running', cpu: 2, memoryGb: 8, createdAt: '2024-03-01', updatedAt: '2024-11-15' },
  { id: 'host-6', hostname: 'dev-env-01', serverId: 'srv-4', serverHostname: 'srv-chi-dev-01', osId: 'os-1', osName: 'Ubuntu Server 22.04 LTS', type: 'vm', status: 'stopped', cpu: 4, memoryGb: 8, createdAt: '2024-03-20', updatedAt: '2024-12-10' },
];

export const ipAddresses: IPAddress[] = [
  { id: 'ip-1', address: '10.1.1.10', hostId: 'host-1', hostHostname: 'web-prod-01', type: 'ipv4', allocation: 'static', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
  { id: 'ip-2', address: '10.1.1.11', hostId: 'host-2', hostHostname: 'web-prod-02', type: 'ipv4', allocation: 'static', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
  { id: 'ip-3', address: '10.1.2.20', hostId: 'host-3', hostHostname: 'api-prod-01', type: 'ipv4', allocation: 'static', createdAt: '2024-02-15', updatedAt: '2024-02-15' },
  { id: 'ip-4', address: '10.1.3.30', hostId: 'host-4', hostHostname: 'db-prod-01', type: 'ipv4', allocation: 'static', createdAt: '2024-04-10', updatedAt: '2024-04-10' },
  { id: 'ip-5', address: '10.2.1.10', hostId: 'host-5', hostHostname: 'cache-prod-01', type: 'ipv4', allocation: 'static', createdAt: '2024-03-01', updatedAt: '2024-03-01' },
  { id: 'ip-6', address: '10.3.1.10', hostId: 'host-6', hostHostname: 'dev-env-01', type: 'ipv4', allocation: 'dhcp', createdAt: '2024-03-20', updatedAt: '2024-03-20' },
  { id: 'ip-7', address: '10.1.1.100', type: 'ipv4', allocation: 'reserved', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'ip-8', address: '10.1.1.101', type: 'ipv4', allocation: 'reserved', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const persons: Person[] = [
  { id: 'per-1', name: 'John Smith', email: 'john.smith@company.com', role: 'Systems Administrator', department: 'IT Operations', phone: '+1-555-0101', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'per-2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Network Engineer', department: 'IT Operations', phone: '+1-555-0102', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'per-3', name: 'Mike Chen', email: 'mike.chen@company.com', role: 'DevOps Engineer', department: 'Engineering', phone: '+1-555-0103', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'per-4', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Database Administrator', department: 'IT Operations', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'per-5', name: 'Alex Turner', email: 'alex.turner@company.com', role: 'Security Engineer', department: 'Security', phone: '+1-555-0105', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const assignments: Assignment[] = [
  { id: 'assign-1', personId: 'per-1', personName: 'John Smith', entityType: 'datacenter', entityId: 'dc-1', role: 'admin', createdAt: '2024-01-15' },
  { id: 'assign-2', personId: 'per-2', personName: 'Sarah Johnson', entityType: 'datacenter', entityId: 'dc-2', role: 'admin', createdAt: '2024-02-20' },
  { id: 'assign-3', personId: 'per-3', personName: 'Mike Chen', entityType: 'server', entityId: 'srv-1', role: 'operator', createdAt: '2024-01-20' },
  { id: 'assign-4', personId: 'per-4', personName: 'Emily Davis', entityType: 'host', entityId: 'host-4', role: 'owner', createdAt: '2024-04-10' },
  { id: 'assign-5', personId: 'per-5', personName: 'Alex Turner', entityType: 'datacenter', entityId: 'dc-1', role: 'viewer', createdAt: '2024-01-15' },
];
