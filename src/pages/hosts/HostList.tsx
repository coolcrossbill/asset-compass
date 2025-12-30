import { useNavigate } from 'react-router-dom';
import { Monitor, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { hosts, ipAddresses } from '@/data/mockData';
import { Host } from '@/types/cmdb';

export default function HostList() {
  const navigate = useNavigate();

  const columns: Column<Host>[] = [
    { 
      key: 'hostname', 
      header: 'Hostname', 
      sortable: true,
      render: (h) => (
        <span className="font-medium font-mono text-foreground">{h.hostname}</span>
      )
    },
    { 
      key: 'serverHostname', 
      header: 'Server',
      render: (h) => (
        <EntityLink to={`/servers/${h.serverId}`}>
          {h.serverHostname}
        </EntityLink>
      )
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (h) => <StatusBadge status={h.type} />
    },
    { 
      key: 'osName', 
      header: 'OS',
      render: (h) => h.osName ? (
        <EntityLink to={`/os/${h.osId}`}>{h.osName}</EntityLink>
      ) : '-'
    },
    { 
      key: 'resources', 
      header: 'Resources',
      render: (h) => (
        <span className="text-muted-foreground">{h.cpu} vCPU • {h.memoryGb} GB</span>
      )
    },
    { 
      key: 'ips', 
      header: 'IPs',
      render: (h) => {
        const hostIps = ipAddresses.filter(ip => ip.hostId === h.id);
        return <span className="text-muted-foreground">{hostIps.length}</span>;
      }
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (h) => <StatusBadge status={h.status} />
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Hosts / VMs" 
        description="Manage virtual machines and containers"
        icon={<Monitor className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Host
          </Button>
        }
      />

      <DataTable 
        data={hosts}
        columns={columns}
        searchKeys={['hostname', 'osName']}
        searchPlaceholder="Search by hostname or OS..."
        onRowClick={(h) => navigate(`/hosts/${h.id}`)}
        emptyMessage="No hosts found"
      />
    </div>
  );
}
