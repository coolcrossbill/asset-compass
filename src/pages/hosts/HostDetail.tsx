import { useParams, useNavigate } from 'react-router-dom';
import { Monitor, ArrowLeft, Server, Network, HardDrive, Cpu, MemoryStick, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { hosts, servers, ipAddresses, operatingSystems, assignments, persons } from '@/data/mockData';
import { IPAddress } from '@/types/cmdb';

export default function HostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const host = hosts.find(h => h.id === id);
  const server = servers.find(s => s.id === host?.serverId);
  const os = operatingSystems.find(o => o.id === host?.osId);
  const hostIps = ipAddresses.filter(ip => ip.hostId === id);
  const hostAssignments = assignments.filter(a => a.entityType === 'host' && a.entityId === id);

  if (!host) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Host not found</p>
        <Button variant="link" onClick={() => navigate('/hosts')}>
          Back to Hosts
        </Button>
      </div>
    );
  }

  const ipColumns: Column<IPAddress>[] = [
    { 
      key: 'address', 
      header: 'Address',
      render: (ip) => <span className="font-mono">{ip.address}</span>
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (ip) => <StatusBadge status={ip.type} />
    },
    { 
      key: 'allocation', 
      header: 'Allocation',
      render: (ip) => <StatusBadge status={ip.allocation} />
    },
  ];

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/hosts')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hosts
      </Button>

      <PageHeader 
        title={host.hostname}
        description={`${host.type.toUpperCase()} on ${server?.hostname}`}
        icon={<Monitor className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={host.status} />
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DetailCard title="Host Details" icon={<Monitor className="h-4 w-4" />}>
          <DetailRow label="Hostname" value={<span className="font-mono">{host.hostname}</span>} />
          <DetailRow label="Type" value={<StatusBadge status={host.type} />} />
          <DetailRow label="Status" value={<StatusBadge status={host.status} />} />
          <DetailRow label="Created" value={host.createdAt} />
          <DetailRow label="Last Updated" value={host.updatedAt} />
        </DetailCard>

        <DetailCard title="Resources" icon={<Cpu className="h-4 w-4" />}>
          <DetailRow 
            label="CPU" 
            value={
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                {host.cpu} vCPU
              </span>
            } 
          />
          <DetailRow 
            label="Memory" 
            value={
              <span className="flex items-center gap-1">
                <MemoryStick className="h-3 w-3" />
                {host.memoryGb} GB
              </span>
            } 
          />
          <DetailRow 
            label="Server" 
            value={
              <EntityLink to={`/servers/${host.serverId}`}>
                {server?.hostname}
              </EntityLink>
            } 
          />
          <DetailRow 
            label="OS" 
            value={os ? (
              <EntityLink to={`/os/${host.osId}`}>
                {os.name} {os.version}
              </EntityLink>
            ) : '-'} 
          />
        </DetailCard>

        <DetailCard title="Assigned Persons" icon={<Users className="h-4 w-4" />}>
          {hostAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No persons assigned</p>
          ) : (
            hostAssignments.map(a => {
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

      <DetailCard title="IP Addresses" icon={<Network className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={hostIps}
          columns={ipColumns}
          searchKeys={['address']}
          searchPlaceholder="Search IPs..."
          onRowClick={(ip) => navigate(`/ips/${ip.id}`)}
          emptyMessage="No IP addresses assigned"
        />
      </DetailCard>
    </div>
  );
}
