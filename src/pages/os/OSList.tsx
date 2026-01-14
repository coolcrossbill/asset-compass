import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardDrive, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { osApi, hostApi } from '@/services/api';
import { OperatingSystem, Host } from '@/types/cmdb';
import { useTranslation } from 'react-i18next';

export default function OSList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [operatingSystems, setOperatingSystems] = useState<OperatingSystem[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [osData, hostsData] = await Promise.all([
          osApi.getAll(),
          hostApi.getAll(),
        ]);
        setOperatingSystems(osData);
        setHosts(hostsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching operating systems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: Column<OperatingSystem>[] = [
    { 
      key: 'name', 
      header: t('common.name'), 
      sortable: true,
      render: (os) => (
        <span className="font-medium text-foreground">{os.name}</span>
      )
    },
    { key: 'version', header: t('operatingSystems.version'), sortable: true },
    { key: 'vendor', header: t('operatingSystems.vendor'), sortable: true },
    { 
      key: 'hosts', 
      header: t('operatingSystems.hosts'),
      render: (os) => {
        const hostCount = hosts.filter(h => h.osId === os.id).length;
        return <span className="text-muted-foreground">{hostCount}</span>;
      }
    },
    { key: 'eolDate', header: t('common.eolDate'), render: (os) => os.eolDate || '-' },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title={t('operatingSystems.title')} 
          description={t('operatingSystems.description')}
          icon={<HardDrive className="h-6 w-6" />}
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
        title={t('operatingSystems.title')} 
        description={t('operatingSystems.description')}
        icon={<HardDrive className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t('operatingSystems.addOS')}
          </Button>
        }
      />

      <DataTable 
        data={operatingSystems}
        columns={columns}
        searchKeys={['name', 'version', 'vendor']}
        searchPlaceholder={t('operatingSystems.searchPlaceholder')}
        onRowClick={(os) => navigate(`/os/${os.id}`)}
        emptyMessage={loading ? t('common.loading') : t('operatingSystems.emptyMessage')}
      />
    </div>
  );
}
