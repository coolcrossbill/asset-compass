import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { ipAddressApi, hostApi } from '@/services/api';
import { IPAddress, Host } from '@/types/cmdb';

export default function IPList() {
  const navigate = useNavigate();
  const [ipAddresses, setIpAddresses] = useState<IPAddress[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ipData, hostsData] = await Promise.all([
          ipAddressApi.getAll(),
          hostApi.getAll(),
        ]);
        setIpAddresses(ipData);
        setHosts(hostsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching IP addresses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      key: 'hostHostname', 
      header: 'Host',
      render: (ip) => {
        const host = hosts.find(h => h.id === ip.hostId);
        return ip.hostId && host ? (
          <EntityLink to={`/hosts/${ip.hostId}`}>{host.hostname}</EntityLink>
        ) : '-';
      }
    },
    { 
      key: 'type', 
      header: 'Type',
      render: (ip) => <StatusBadge status={ip.type} />
    },
    { 
      key: 'allocation', 
      header: 'Allocation', 
      sortable: true,
      render: (ip) => <StatusBadge status={ip.allocation} />
    },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="IP Addresses" 
          description="Manage IP address allocations"
          icon={<Network className="h-6 w-6" />}
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
        title="IP Addresses" 
        description="Manage IP address allocations"
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
        searchKeys={['address']}
        searchPlaceholder="Search by IP address..."
        onRowClick={(ip) => navigate(`/ips/${ip.id}`)}
        emptyMessage={loading ? "Loading..." : "No IP addresses found"}
      />
    </div>
  );
}
