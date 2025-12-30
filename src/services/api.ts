import { api } from '@/lib/api';
import type {
  Datacenter,
  Server,
  Host,
  IPAddress,
  OperatingSystem,
  Person,
  Assignment,
} from '@/types/cmdb';

// Datacenter API
export const datacenterApi = {
  getAll: () => api.get<Datacenter[]>('/api/datacenters'),
  getById: (id: string) => api.get<Datacenter>(`/api/datacenters/${id}`),
  create: (data: Omit<Datacenter, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Datacenter>('/api/datacenters', data),
  update: (id: string, data: Omit<Datacenter, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<Datacenter>(`/api/datacenters/${id}`, data),
  delete: (id: string) => api.delete(`/api/datacenters/${id}`),
};

// Server API
export const serverApi = {
  getAll: () => api.get<Server[]>('/api/servers'),
  getById: (id: string) => api.get<Server>(`/api/servers/${id}`),
  create: (data: Omit<Server, 'id' | 'createdAt' | 'updatedAt' | 'datacenterName'>) =>
    api.post<Server>('/api/servers', data),
  update: (id: string, data: Omit<Server, 'id' | 'createdAt' | 'updatedAt' | 'datacenterName'>) =>
    api.put<Server>(`/api/servers/${id}`, data),
  delete: (id: string) => api.delete(`/api/servers/${id}`),
};

// Host API
export const hostApi = {
  getAll: () => api.get<Host[]>('/api/hosts'),
  getById: (id: string) => api.get<Host>(`/api/hosts/${id}`),
  create: (data: Omit<Host, 'id' | 'createdAt' | 'updatedAt' | 'serverHostname' | 'osName'>) =>
    api.post<Host>('/api/hosts', data),
  update: (id: string, data: Omit<Host, 'id' | 'createdAt' | 'updatedAt' | 'serverHostname' | 'osName'>) =>
    api.put<Host>(`/api/hosts/${id}`, data),
  delete: (id: string) => api.delete(`/api/hosts/${id}`),
};

// IP Address API
export const ipAddressApi = {
  getAll: () => api.get<IPAddress[]>('/api/ip-addresses'),
  getById: (id: string) => api.get<IPAddress>(`/api/ip-addresses/${id}`),
  create: (data: Omit<IPAddress, 'id' | 'createdAt' | 'updatedAt' | 'hostHostname'>) =>
    api.post<IPAddress>('/api/ip-addresses', data),
  update: (id: string, data: Omit<IPAddress, 'id' | 'createdAt' | 'updatedAt' | 'hostHostname'>) =>
    api.put<IPAddress>(`/api/ip-addresses/${id}`, data),
  delete: (id: string) => api.delete(`/api/ip-addresses/${id}`),
};

// Operating System API
export const osApi = {
  getAll: () => api.get<OperatingSystem[]>('/api/operating-systems'),
  getById: (id: string) => api.get<OperatingSystem>(`/api/operating-systems/${id}`),
  create: (data: Omit<OperatingSystem, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<OperatingSystem>('/api/operating-systems', data),
  update: (id: string, data: Omit<OperatingSystem, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<OperatingSystem>(`/api/operating-systems/${id}`, data),
  delete: (id: string) => api.delete(`/api/operating-systems/${id}`),
};

// Alias for consistency
export const operatingSystemApi = osApi;

// Person API
export const personApi = {
  getAll: () => api.get<Person[]>('/api/persons'),
  getById: (id: string) => api.get<Person>(`/api/persons/${id}`),
  create: (data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Person>('/api/persons', data),
  update: (id: string, data: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<Person>(`/api/persons/${id}`, data),
  delete: (id: string) => api.delete(`/api/persons/${id}`),
};

// Assignment API
export const assignmentApi = {
  getAll: () => api.get<Assignment[]>('/api/assignments'),
  getById: (id: string) => api.get<Assignment>(`/api/assignments/${id}`),
  create: (data: Omit<Assignment, 'id' | 'createdAt' | 'personName'>) =>
    api.post<Assignment>('/api/assignments', data),
  update: (id: string, data: Omit<Assignment, 'id' | 'createdAt' | 'personName'>) =>
    api.put<Assignment>(`/api/assignments/${id}`, data),
  delete: (id: string) => api.delete(`/api/assignments/${id}`),
};

