import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, Briefcase, FileText, Link } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PersonEditDialog } from '@/components/dialogs/PersonEditDialog';
import { personApi, assignmentApi, datacenterApi, serverApi, hostApi } from '@/services/api';
import { Person, Assignment, Datacenter, Server as ServerType, Host } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [person, setPerson] = useState<Person | null>(null);
  const [personAssignments, setPersonAssignments] = useState<Assignment[]>([]);
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [personData, assignmentsData, datacentersData, serversData, hostsData] = await Promise.all([
        personApi.getById(id),
        assignmentApi.getAll(),
        datacenterApi.getAll(),
        serverApi.getAll(),
        hostApi.getAll(),
      ]);
      
      setPerson(personData);
      setPersonAssignments(assignmentsData.filter(a => a.personId === id));
      setDatacenters(datacentersData);
      setServers(serversData);
      setHosts(hostsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching person details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      await personApi.delete(id);
      toast({
        title: "Person deleted",
        description: "The person has been successfully deleted.",
      });
      navigate('/persons');
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : 'Failed to delete person',
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

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
        <Button onClick={() => navigate('/persons')}>Back to Persons</Button>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Person not found</p>
        <Button variant="link" onClick={() => navigate('/persons')}>
          Back to Persons
        </Button>
      </div>
    );
  }

  const getEntityName = (a: Assignment) => {
    switch (a.entityType) {
      case 'datacenter':
        return datacenters.find(dc => dc.id === a.entityId)?.name || a.entityId;
      case 'server':
        return servers.find(s => s.id === a.entityId)?.hostname || a.entityId;
      case 'host':
        return hosts.find(h => h.id === a.entityId)?.hostname || a.entityId;
      default:
        return a.entityId;
    }
  };

  const getEntityLink = (a: Assignment) => {
    switch (a.entityType) {
      case 'datacenter':
        return `/datacenters/${a.entityId}`;
      case 'server':
        return `/servers/${a.entityId}`;
      case 'host':
        return `/hosts/${a.entityId}`;
      default:
        return '#';
    }
  };

  const assignmentColumns: Column<Assignment>[] = [
    { 
      key: 'entityType', 
      header: 'Type',
      render: (a) => <span className="capitalize">{a.entityType}</span>
    },
    { 
      key: 'entity', 
      header: 'Entity',
      render: (a) => (
        <EntityLink to={getEntityLink(a)}>
          {getEntityName(a)}
        </EntityLink>
      )
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (a) => <StatusBadge status={a.role} />
    },
    { key: 'createdAt', header: 'Assigned' },
  ];

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/persons')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Persons
      </Button>

      <PageHeader 
        title={person.name}
        description={`${person.role}`}
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>Edit</Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />

      {person && (
        <PersonEditDialog
          person={person}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchData}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Person"
        description={`Are you sure you want to delete ${person.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DetailCard title="Contact Information" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Name" value={person.name} />
          <DetailRow 
            label="Email" 
            value={
              <a 
                href={`mailto:${person.email}`} 
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                {person.email}
              </a>
            } 
          />
          <DetailRow label="Created" value={person.createdAt} />
          <DetailRow label="Last Updated" value={person.updatedAt} />
        </DetailCard>

        <DetailCard title="Role Information" icon={<Briefcase className="h-4 w-4" />}>
          <DetailRow 
            label="Role" 
            value={
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {person.role}
              </span>
            } 
          />
          <DetailRow 
            label="Total Assignments" 
            value={personAssignments.length}
          />
        </DetailCard>
      </div>

      <DetailCard title="Assignments" icon={<Link className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={personAssignments}
          columns={assignmentColumns}
          emptyMessage="No assignments"
        />
      </DetailCard>
    </div>
  );
}
