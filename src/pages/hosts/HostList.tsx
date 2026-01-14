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
import { useTranslation } from 'react-i18next';

export default function HostList() {
  const { t } = useTranslation();
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
      header: t('common.hostname'), 
      sortable: true,
      render: (h) => (
        <span className="font-medium font-mono text-foreground">{h.hostname}</span>
      )
    },
    { 
      key: 'serverHostname', 
      header: t('hosts.server'),
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
      header: t('common.type'),
      render: (h) => <StatusBadge status={h.type} />
    },
    { 
      key: 'osName', 
      header: t('common.os'),
      render: (h) => {
        const os = operatingSystems.find(o => o.id === h.osId);
        return h.osId && os ? (
          <EntityLink to={`/os/${h.osId}`}>{`${os.name} ${os.version}`}</EntityLink>
        ) : '-';
      }
    },
    { 
      key: 'resources', 
      header: t('common.resources'),
      render: (h) => (
        <span className="text-muted-foreground">{h.cpu} vCPU • {h.memoryGb} GB</span>
      )
    },
    { 
      key: 'ips', 
      header: t('hosts.ipAddresses'),
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
      header: t('common.status'), 
      sortable: true,
      render: (h) => <StatusBadge status={h.status} />
    },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={t('hosts.title')} 
          description={t('hosts.description')}
          icon={<Monitor className="h-6 w-6" />}
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">{t('common.error')}: {error}</p>
          <Button onClick={() => window.location.reload()}>{t('common.retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={t('hosts.title')} 
        description={t('hosts.description')}
        icon={<Monitor className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('hosts.addHost')}
          </Button>
        }
      />

      <DataTable 
        data={hosts}
        columns={columns}
        searchKeys={['hostname']}
        searchPlaceholder={t('hosts.searchPlaceholder')}
        onRowClick={(h) => navigate(`/hosts/${h.id}`)}
        emptyMessage={loading ? t('common.loading') : t('hosts.emptyMessage')}
      />
    </div>
  );
}
