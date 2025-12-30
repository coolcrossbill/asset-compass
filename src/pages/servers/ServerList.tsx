import { useNavigate } from 'react-router-dom';
import { Server, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { servers, hosts } from '@/data/mockData';
import { Server as ServerType } from '@/types/cmdb';

export default function ServerList() {
  const navigate = useNavigate();

  const columns: Column<ServerType>[] = [
    { 
      key: 'hostname', 
      header: 'Hostname', 
      sortable: true,
      render: (srv) => (
        <span className="font-medium font-mono text-foreground">{srv.hostname}</span>
      )
    },
    { 
      key: 'datacenterName', 
      header: 'Datacenter',
      render: (srv) => (
        <EntityLink to={`/datacenters/${srv.datacenterId}`}>
          {srv.datacenterName}
        </EntityLink>
      )
    },
    { key: 'model', header: 'Model', sortable: true },
    { 
      key: 'serialNumber', 
      header: 'Serial #',
      render: (srv) => <span className="font-mono text-muted-foreground">{srv.serialNumber}</span>
    },
    { 
      key: 'hosts', 
      header: 'Hosts',
      render: (srv) => {
        const hostCount = hosts.filter(h => h.serverId === srv.id).length;
        return <span className="text-muted-foreground">{hostCount}</span>;
      }
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (srv) => <StatusBadge status={srv.status} />
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Servers" 
        description="Manage physical servers across datacenters"
        icon={<Server className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Server
          </Button>
        }
      />

      <DataTable 
        data={servers}
        columns={columns}
        searchKeys={['hostname', 'serialNumber', 'model']}
        searchPlaceholder="Search by hostname, serial, or model..."
        onRowClick={(srv) => navigate(`/servers/${srv.id}`)}
        emptyMessage="No servers found"
      />
    </div>
  );
}
