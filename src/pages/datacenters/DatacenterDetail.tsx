import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Server, MapPin, Calendar, FileText, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { DatacenterEditDialog } from '@/components/dialogs/DatacenterEditDialog';
import { datacenterApi, serverApi, assignmentApi, personApi } from '@/services/api';
import { Datacenter, Server as ServerType, Assignment, Person } from '@/types/cmdb';

export default function DatacenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [datacenter, setDatacenter] = useState<Datacenter | null>(null);
  const [dcServers, setDcServers] = useState<ServerType[]>([]);
  const [dcAssignments, setDcAssignments] = useState<Assignment[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [dcData, serversData, assignmentsData, personsData] = await Promise.all([
        datacenterApi.getById(id),
        serverApi.getAll(),
        assignmentApi.getAll(),
        personApi.getAll(),
      ]);
      
      setDatacenter(dcData);
      setDcServers(serversData.filter(s => s.datacenterId === id));
      setDcAssignments(assignmentsData.filter(a => a.entityType === 'datacenter' && a.entityId === id));
      setPersons(personsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching datacenter details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate('/datacenters')}>Back to Datacenters</Button>
      </div>
    );
  }

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
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      {datacenter && (
        <DatacenterEditDialog
          datacenter={datacenter}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchData}
        />
      )}

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
