import { useNavigate } from 'react-router-dom';
import { Network, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ipAddresses } from '@/data/mockData';
import { IPAddress } from '@/types/cmdb';

export default function IPList() {
  const navigate = useNavigate();

  const columns: Column<IPAddress>[] = [
    { 
      key: 'address', 
      header: 'IP Address', 
      sortable: true,
      render: (ip) => (
        <span className="font-medium font-mono text-foreground">{ip.address}</span>
      )
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
    { 
      key: 'hostHostname', 
      header: 'Assigned Host',
      render: (ip) => ip.hostId ? (
        <EntityLink to={`/hosts/${ip.hostId}`}>
          {ip.hostHostname}
        </EntityLink>
      ) : <span className="text-muted-foreground">Unassigned</span>
    },
    { key: 'createdAt', header: 'Created', sortable: true },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="IP Addresses" 
        description="Manage IP address allocation"
        icon={<Network className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add IP Address
          </Button>
        }
      />

      <DataTable 
        data={ipAddresses}
        columns={columns}
        searchKeys={['address', 'hostHostname']}
        searchPlaceholder="Search by IP or hostname..."
        onRowClick={(ip) => navigate(`/ips/${ip.id}`)}
        emptyMessage="No IP addresses found"
      />
    </div>
  );
}
