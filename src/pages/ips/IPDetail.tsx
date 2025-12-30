import { useParams, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft, Monitor, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ipAddresses, hosts, servers } from '@/data/mockData';

export default function IPDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const ip = ipAddresses.find(i => i.id === id);
  const host = hosts.find(h => h.id === ip?.hostId);
  const server = servers.find(s => s.id === host?.serverId);

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
        description={`${ip.type.toUpperCase()} • ${ip.allocation}`}
        icon={<Network className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <StatusBadge status={ip.allocation} />
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailCard title="IP Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Address" value={<span className="font-mono">{ip.address}</span>} />
          <DetailRow label="Type" value={<StatusBadge status={ip.type} />} />
          <DetailRow label="Allocation" value={<StatusBadge status={ip.allocation} />} />
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
