import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HardDrive, ArrowLeft, Monitor, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { OSEditDialog } from '@/components/dialogs/OSEditDialog';
import { operatingSystemApi, hostApi } from '@/services/api';
import { OperatingSystem, Host } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

export default function OSDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [os, setOs] = useState<OperatingSystem | null>(null);
  const [osHosts, setOsHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [osData, hostsData] = await Promise.all([
        operatingSystemApi.getById(id),
        hostApi.getAll(),
      ]);
      
      setOs(osData);
      setOsHosts(hostsData.filter(h => h.osId === id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching OS details:', err);
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
      await operatingSystemApi.delete(id);
      toast({
        title: "Operating System deleted",
        description: "The operating system has been successfully deleted.",
      });
      navigate('/os');
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : 'Failed to delete operating system',
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
        <Button onClick={() => navigate('/os')}>Back to Operating Systems</Button>
      </div>
    );
  }
  
  const isEol = os?.eolDate && new Date(os.eolDate) < new Date();

  if (!os) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Operating System not found</p>
        <Button variant="link" onClick={() => navigate('/os')}>
          Back to Operating Systems
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
        onClick={() => navigate('/os')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Operating Systems
      </Button>

      <PageHeader 
        title={`${os.name} ${os.version}`}
        description={`Family: ${os.family}`}
        icon={<HardDrive className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            {isEol && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/15 text-destructive text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                End of Life
              </div>
            )}
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

      {os && (
        <OSEditDialog
          os={os}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchData}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Operating System"
        description={`Are you sure you want to delete ${os.name} ${os.version}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DetailCard title="OS Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Name" value={os.name} />
          <DetailRow label="Version" value={<span className="font-mono">{os.version}</span>} />
          <DetailRow label="Family" value={os.family} />
          <DetailRow label="Created" value={os.createdAt} />
          <DetailRow label="Last Updated" value={os.updatedAt} />
        </DetailCard>

        <DetailCard title="Lifecycle" icon={<Calendar className="h-4 w-4" />}>
          <DetailRow 
            label="EOL Date" 
            value={os.eolDate ? (
              <span className={isEol ? 'text-destructive font-medium' : ''}>
                {os.eolDate}
                {isEol && ' (Expired)'}
              </span>
            ) : 'Not specified'} 
          />
          <DetailRow label="Hosts Using" value={osHosts.length} />
          <DetailRow 
            label="Running Hosts" 
            value={osHosts.filter(h => h.status === 'running').length} 
          />
        </DetailCard>
      </div>

      <DetailCard title="Hosts Using This OS" icon={<Monitor className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={osHosts}
          columns={hostColumns}
          searchKeys={['hostname']}
          searchPlaceholder="Search hosts..."
          onRowClick={(h) => navigate(`/hosts/${h.id}`)}
          emptyMessage="No hosts using this OS"
        />
      </DetailCard>
    </div>
  );
}
