import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { datacenterApi, serverApi } from '@/services/api';
import { Datacenter, Server } from '@/types/cmdb';
import { useTranslation } from 'react-i18next';

export default function DatacenterList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [datacenters, setDatacenters] = useState<Datacenter[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [datacentersData, serversData] = await Promise.all([
          datacenterApi.getAll(),
          serverApi.getAll(),
        ]);
        setDatacenters(datacentersData);
        setServers(serversData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching datacenters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<Datacenter>[] = [
    { 
      key: 'name', 
      header: t('common.name'), 
      sortable: true,
      render: (dc) => (
        <span className="font-medium text-foreground">{dc.name}</span>
      )
    },
    { 
      key: 'location', 
      header: t('common.location'), 
      sortable: true,
      render: (dc) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {dc.location}
        </div>
      )
    },
    { 
      key: 'servers', 
      header: t('datacenters.servers'),
      render: (dc) => {
        const serverCount = servers?.filter(s => s.datacenterId === dc.id).length || 0;
        return <span className="text-muted-foreground">{serverCount}</span>;
      }
    },
    { key: 'description', header: t('common.description'), className: 'max-w-xs truncate' },
    { key: 'updatedAt', header: t('common.lastUpdated'), sortable: true },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={t('datacenters.title')} 
          description={t('datacenters.description')}
          icon={<Building2 className="h-6 w-6" />}
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
        title={t('datacenters.title')} 
        description={t('datacenters.description')}
        icon={<Building2 className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('datacenters.addDatacenter')}
          </Button>
        }
      />

      <DataTable 
        data={datacenters}
        columns={columns}
        searchKeys={['name', 'location']}
        searchPlaceholder={t('datacenters.searchPlaceholder')}
        onRowClick={(dc) => navigate(`/datacenters/${dc.id}`)}
        emptyMessage={loading ? t('common.loading') : t('datacenters.emptyMessage')}
      />
    </div>
  );
}
