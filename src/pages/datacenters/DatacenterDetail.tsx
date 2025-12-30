import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Server, MapPin, Calendar, FileText, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { datacenters, servers, assignments, persons } from '@/data/mockData';
import { Server as ServerType } from '@/types/cmdb';

export default function DatacenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const datacenter = datacenters.find(dc => dc.id === id);
  const dcServers = servers.filter(s => s.datacenterId === id);
  const dcAssignments = assignments.filter(a => a.entityType === 'datacenter' && a.entityId === id);

  if (!datacenter) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Datacenter not found</p>
        <Button variant="link" onClick={() => navigate('/datacenters')}>
          Back to Datacenters
        </Button>
      </div>
    );
  }

  const serverColumns: Column<ServerType>[] = [
    { 
      key: 'hostname', 
      header: 'Hostname',
      render: (srv) => (
        <EntityLink to={`/servers/${srv.id}`}>{srv.hostname}</EntityLink>
      )
    },
    { key: 'model', header: 'Model' },
    { 
      key: 'status', 
      header: 'Status',
      render: (srv) => <StatusBadge status={srv.status} />
    },
  ];

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/datacenters')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Datacenters
      </Button>

      <PageHeader 
        title={datacenter.name}
        description={datacenter.description}
        icon={<Building2 className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DetailCard title="Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Name" value={datacenter.name} />
          <DetailRow 
            label="Location" 
            value={
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {datacenter.location}
              </span>
            } 
          />
          <DetailRow 
            label="Created" 
            value={
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {datacenter.createdAt}
              </span>
            } 
          />
          <DetailRow label="Last Updated" value={datacenter.updatedAt} />
        </DetailCard>

        <DetailCard title="Statistics" icon={<Server className="h-4 w-4" />}>
          <DetailRow label="Total Servers" value={dcServers.length} />
          <DetailRow label="Online" value={dcServers.filter(s => s.status === 'online').length} />
          <DetailRow label="Maintenance" value={dcServers.filter(s => s.status === 'maintenance').length} />
          <DetailRow label="Offline" value={dcServers.filter(s => s.status === 'offline').length} />
        </DetailCard>

        <DetailCard title="Assigned Persons" icon={<Users className="h-4 w-4" />}>
          {dcAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No persons assigned</p>
          ) : (
            dcAssignments.map(a => {
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

      <DetailCard title="Servers" icon={<Server className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={dcServers}
          columns={serverColumns}
          searchKeys={['hostname']}
          searchPlaceholder="Search servers..."
          onRowClick={(srv) => navigate(`/servers/${srv.id}`)}
          emptyMessage="No servers in this datacenter"
        />
      </DetailCard>
    </div>
  );
}
