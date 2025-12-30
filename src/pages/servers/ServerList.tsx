import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { serverApi, hostApi, datacenterApi } from '@/services/api';
import { Server as ServerType, Host, Datacenter } from '@/types/cmdb';

export default function ServerList() {
  const navigate = useNavigate();
  const [servers, setServers] = useState<ServerType[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [serversData, hostsData, datacentersData] = await Promise.all([
          serverApi.getAll(),
          hostApi.getAll(),
          datacenterApi.getAll(),
        ]);
        setServers(serversData);
        setHosts(hostsData);
        setDatacenters(datacentersData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching servers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      render: (srv) => {
        const dc = datacenters.find(d => d.id === srv.datacenterId);
        return (
          <EntityLink to={`/datacenters/${srv.datacenterId}`}>
            {dc?.name || srv.datacenterId}
          </EntityLink>
        );
      }
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

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Servers" 
          description="Manage physical servers across datacenters"
          icon={<Server className="h-6 w-6" />}
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
        emptyMessage={loading ? "Loading..." : "No servers found"}
      />
    </div>
  );
}
