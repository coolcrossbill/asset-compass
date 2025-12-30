import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft, Monitor, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IPEditDialog } from '@/components/dialogs/IPEditDialog';
import { ipAddressApi, hostApi, serverApi } from '@/services/api';
import { IPAddress, Host, Server as ServerType } from '@/types/cmdb';
import { useToast } from '@/hooks/use-toast';

export default function IPDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ip, setIp] = useState<IPAddress | null>(null);
  const [host, setHost] = useState<Host | null>(null);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [server, setServer] = useState<ServerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [ipData, hostsData] = await Promise.all([
        ipAddressApi.getById(id),
        hostApi.getAll(),
      ]);
      
      setIp(ipData);
      setHosts(hostsData);
      
      if (ipData.hostId) {
        const hostData = hostsData.find(h => h.id === ipData.hostId);
        setHost(hostData || null);
        
        if (hostData?.serverId) {
          const serverData = await serverApi.getById(hostData.serverId);
          setServer(serverData);
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching IP details:', err);
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
      await ipAddressApi.delete(id);
      toast({
        title: "IP Address deleted",
        description: "The IP address has been successfully deleted.",
      });
      navigate('/ips');
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : 'Failed to delete IP address',
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
        <Button onClick={() => navigate('/ips')}>Back to IP Addresses</Button>
      </div>
    );
  }

  if (!ip) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">IP Address not found</p>
        <Button variant="link" onClick={() => navigate('/ips')}>
          Back to IP Addresses
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/ips')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to IP Addresses
      </Button>

      <PageHeader 
        title={ip.address}
        description={`${ip.type.toUpperCase()}`}
        icon={<Network className="h-6 w-6" />}
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

      {ip && (
        <IPEditDialog
          ipAddress={ip}
          hosts={hosts}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={fetchData}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete IP Address"
        description={`Are you sure you want to delete ${ip.address}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailCard title="IP Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Address" value={<span className="font-mono">{ip.address}</span>} />
          <DetailRow label="Type" value={<StatusBadge status={ip.type} />} />
          <DetailRow label="Created" value={ip.createdAt} />
          <DetailRow label="Last Updated" value={ip.updatedAt} />
        </DetailCard>

        <DetailCard title="Assignment" icon={<Monitor className="h-4 w-4" />}>
          {host ? (
            <>
              <DetailRow 
                label="Host" 
                value={
                  <EntityLink to={`/hosts/${host.id}`}>
                    {host.hostname}
                  </EntityLink>
                } 
              />
              <DetailRow label="Host Type" value={<StatusBadge status={host.type} />} />
              <DetailRow label="Host Status" value={<StatusBadge status={host.status} />} />
              {server && (
                <DetailRow 
                  label="Server" 
                  value={
                    <EntityLink to={`/servers/${server.id}`}>
                      {server.hostname}
                    </EntityLink>
                  } 
                />
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-4">This IP is not assigned to any host</p>
          )}
        </DetailCard>
      </div>
    </div>
  );
}
