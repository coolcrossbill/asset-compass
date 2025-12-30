import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { hostApi, serverApi, osApi, ipAddressApi } from '@/services/api';
import { Host, Server, OperatingSystem, IPAddress } from '@/types/cmdb';

export default function HostList() {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [operatingSystems, setOperatingSystems] = useState<OperatingSystem[]>([]);
  const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hostsData, serversData, osData, ipData] = await Promise.all([
          hostApi.getAll(),
          serverApi.getAll(),
          osApi.getAll(),
          ipAddressApi.getAll(),
        ]);
        setHosts(hostsData);
        setServers(serversData);
        setOperatingSystems(osData);
        setIpAddresses(ipData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching hosts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      render: (h) => {
        const server = servers.find(s => s.id === h.serverId);
        return (
          <EntityLink to={`/servers/${h.serverId}`}>
            {server?.hostname || h.serverId}
          </EntityLink>
        );
      }
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (h) => <StatusBadge status={h.type} />
    },
    { 
      key: 'osName', 
      header: 'OS',
      render: (h) => {
        const os = operatingSystems.find(o => o.id === h.osId);
        return h.osId && os ? (
          <EntityLink to={`/os/${h.osId}`}>{`${os.name} ${os.version}`}</EntityLink>
        ) : '-';
      }
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
      header: 'IP Addresses',
      render: (h) => {
        const hostIps = ipAddresses.filter(ip => ip.hostId === h.id);
        return hostIps.length > 0 ? (
          <span className="text-muted-foreground font-mono text-sm">
            {hostIps.map(ip => ip.address).join(', ')}
          </span>
        ) : '-';
      }
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (h) => <StatusBadge status={h.status} />
    },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Hosts / VMs" 
          description="Manage virtual machines and containers"
          icon={<Monitor className="h-6 w-6" />}
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
        searchKeys={['hostname']}
        searchPlaceholder="Search by hostname..."
        onRowClick={(h) => navigate(`/hosts/${h.id}`)}
        emptyMessage={loading ? "Loading..." : "No hosts found"}
      />
    </div>
  );
}
