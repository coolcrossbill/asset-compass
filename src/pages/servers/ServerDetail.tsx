import { useParams, useNavigate } from 'react-router-dom';
import { Server, ArrowLeft, Monitor, Building2, FileText, Hash, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { servers, hosts, assignments, persons, datacenters } from '@/data/mockData';
import { Host } from '@/types/cmdb';

export default function ServerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const server = servers.find(s => s.id === id);
  const serverHosts = hosts.filter(h => h.serverId === id);
  const serverAssignments = assignments.filter(a => a.entityType === 'server' && a.entityId === id);
  const datacenter = datacenters.find(dc => dc.id === server?.datacenterId);

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Server not found</p>
        <Button variant="link" onClick={() => navigate('/servers')}>
          Back to Servers
        </Button>
      </div>
    );
  }

  const hostColumns: Column<Host>[] = [
    { 
      key: 'hostname', 
      header: 'Hostname',
      render: (h) => <EntityLink to={`/hosts/${h.id}`}>{h.hostname}</EntityLink>
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (h) => <StatusBadge status={h.type} />
    },
    { key: 'cpu', header: 'CPU', render: (h) => `${h.cpu} vCPU` },
    { key: 'memoryGb', header: 'Memory', render: (h) => `${h.memoryGb} GB` },
    { 
      key: 'status', 
      header: 'Status',
      render: (h) => <StatusBadge status={h.status} />
    },
  ];

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/servers')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Servers
      </Button>

      <PageHeader 
        title={server.hostname}
        description={`${server.model} • ${server.serialNumber}`}
        icon={<Server className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={server.status} />
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DetailCard title="Hardware Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Hostname" value={<span className="font-mono">{server.hostname}</span>} />
          <DetailRow label="Model" value={server.model} />
          <DetailRow 
            label="Serial Number" 
            value={<span className="font-mono">{server.serialNumber}</span>} 
          />
          <DetailRow label="Status" value={<StatusBadge status={server.status} />} />
        </DetailCard>

        <DetailCard title="Location" icon={<Building2 className="h-4 w-4" />}>
          <DetailRow 
            label="Datacenter" 
            value={
              <EntityLink to={`/datacenters/${server.datacenterId}`}>
                {datacenter?.name}
              </EntityLink>
            } 
          />
          <DetailRow label="Location" value={datacenter?.location} />
          <DetailRow label="Created" value={server.createdAt} />
          <DetailRow label="Last Updated" value={server.updatedAt} />
        </DetailCard>

        <DetailCard title="Assigned Persons" icon={<Users className="h-4 w-4" />}>
          {serverAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No persons assigned</p>
          ) : (
            serverAssignments.map(a => {
              const person = persons.find(p => p.id === a.personId);
              return (
                <DetailRow 
                  key={a.id}
                  label={<EntityLink to={`/persons/${a.personId}`}>{person?.name}</EntityLink>}
                  value={<StatusBadge status={a.role} />}
                />
              );
            })
          )}
        </DetailCard>
      </div>

      <DetailCard title="Hosts / VMs" icon={<Monitor className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={serverHosts}
          columns={hostColumns}
          searchKeys={['hostname']}
          searchPlaceholder="Search hosts..."
          onRowClick={(h) => navigate(`/hosts/${h.id}`)}
          emptyMessage="No hosts on this server"
        />
      </DetailCard>
    </div>
  );
}
