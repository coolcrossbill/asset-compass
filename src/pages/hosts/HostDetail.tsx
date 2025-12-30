import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Monitor, ArrowLeft, Server, Network, HardDrive, Cpu, MemoryStick, Users } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HostEditDialog } from '@/components/dialogs/HostEditDialog';
import { hostApi, serverApi, ipAddressApi, osApi, assignmentApi, personApi, operatingSystemApi } from '@/services/api';
import { Host, Server as ServerType, IPAddress, OperatingSystem, Assignment, Person } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

export default function HostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [host, setHost] = useState<Host | null>(null);
  const [server, setServer] = useState<ServerType | null>(null);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [os, setOs] = useState<OperatingSystem | null>(null);
  const [operatingSystems, setOperatingSystems] = useState<OperatingSystem[]>([]);
  const [hostIps, setHostIps] = useState<IPAddress[]>([]);
  const [hostAssignments, setHostAssignments] = useState<Assignment[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [hostData, ipsData, assignmentsData, personsData, serversData, osData] = await Promise.all([
        hostApi.getById(id),
        ipAddressApi.getAll(),
        assignmentApi.getAll(),
        personApi.getAll(),
        serverApi.getAll(),
        operatingSystemApi.getAll(),
      ]);
      
      setHost(hostData);
      setHostIps(ipsData.filter(ip => ip.hostId === id));
      setHostAssignments(assignmentsData.filter(a => a.entityType === 'host' && a.entityId === id));
      setPersons(personsData);
      setServers(serversData);
      setOperatingSystems(osData);
      
      if (hostData.serverId) {
        const serverData = serversData.find(s => s.id === hostData.serverId);
        setServer(serverData || null);
      }
      
      if (hostData.osId) {
        const osDataItem = osData.find(o => o.id === hostData.osId);
        setOs(osDataItem || null);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching host details:', err);
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
      await hostApi.delete(id);
      toast({
        title: "Host deleted",
        description: "The host has been successfully deleted.",
      });
      navigate('/hosts');
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : 'Failed to delete host',
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
        <Button onClick={() => navigate('/hosts')}>Back to Hosts</Button>
      </div>
    );
  }

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
        description={`${host.type} • ${host.cpu} vCPU • ${host.memoryGb} GB`}
        icon={<Monitor className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={host.status} />
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

      {host && (
        <HostEditDialog
          host={host}
          servers={servers}
          operatingSystems={operatingSystems}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchData}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Host"
        description={`Are you sure you want to delete ${host.hostname}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DetailCard title="Host Details" icon={<Monitor className="h-4 w-4" />}>
          <DetailRow label="Hostname" value={<span className="font-mono">{host.hostname}</span>} />
          <DetailRow label="Type" value={<StatusBadge status={host.type} />} />
          <DetailRow label="Status" value={<StatusBadge status={host.status} />} />
          <DetailRow 
            label="Server" 
            value={
              server ? (
                <EntityLink to={`/servers/${host.serverId}`}>
                  {server.hostname}
                </EntityLink>
              ) : host.serverId
            } 
          />
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
          <DetailRow label="Created" value={host.createdAt} />
          <DetailRow label="Last Updated" value={host.updatedAt} />
        </DetailCard>

        <DetailCard title="Operating System" icon={<HardDrive className="h-4 w-4" />}>
          {os ? (
            <>
          <DetailRow 
                label="OS" 
            value={
                  <EntityLink to={`/os/${host.osId}`}>
                    {os.name}
              </EntityLink>
            } 
          />
              <DetailRow label="Version" value={os.version} />
              <DetailRow label="Vendor" value={os.vendor} />
              {os.eolDate && <DetailRow label="EOL Date" value={os.eolDate} />}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No OS assigned</p>
          )}
        </DetailCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailCard title="IP Addresses" icon={<Network className="h-4 w-4" />}>
          <DataTable 
            data={hostIps}
            columns={ipColumns}
            searchKeys={['address']}
            searchPlaceholder="Search IPs..."
            emptyMessage="No IP addresses assigned"
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
    </div>
  );
}
