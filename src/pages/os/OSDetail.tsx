import { useParams, useNavigate } from 'react-router-dom';
import { HardDrive, ArrowLeft, Monitor, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { operatingSystems, hosts } from '@/data/mockData';
import { Host } from '@/types/cmdb';

export default function OSDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const os = operatingSystems.find(o => o.id === id);
  const osHosts = hosts.filter(h => h.osId === id);
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
      key: 'serverHostname', 
      header: 'Server',
      render: (h) => <EntityLink to={`/servers/${h.serverId}`}>{h.serverHostname}</EntityLink>
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (h) => <StatusBadge status={h.type} />
    },
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
        description={`Vendor: ${os.vendor}`}
        icon={<HardDrive className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            {isEol && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/15 text-destructive text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                End of Life
              </div>
            )}
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DetailCard title="OS Details" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Name" value={os.name} />
          <DetailRow label="Version" value={<span className="font-mono">{os.version}</span>} />
          <DetailRow label="Vendor" value={os.vendor} />
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
