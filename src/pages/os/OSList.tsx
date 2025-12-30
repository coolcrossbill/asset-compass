import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardDrive, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { osApi, hostApi } from '@/services/api';
import { OperatingSystem, Host } from '@/types/cmdb';

export default function OSList() {
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
      header: 'Name', 
      sortable: true,
      render: (os) => (
        <span className="font-medium text-foreground">{os.name}</span>
      )
    },
    { key: 'version', header: 'Version', sortable: true },
    { key: 'vendor', header: 'Vendor', sortable: true },
    { 
      key: 'hosts', 
      header: 'Hosts',
      render: (os) => {
        const hostCount = hosts.filter(h => h.osId === os.id).length;
        return <span className="text-muted-foreground">{hostCount}</span>;
      }
    },
    { key: 'eolDate', header: 'EOL Date', render: (os) => os.eolDate || '-' },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Operating Systems" 
          description="Manage operating system types"
          icon={<HardDrive className="h-6 w-6" />}
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
        title="Operating Systems" 
        description="Manage operating system types"
        icon={<HardDrive className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add OS
          </Button>
        }
      />

      <DataTable 
        data={operatingSystems}
        columns={columns}
        searchKeys={['name', 'version', 'vendor']}
        searchPlaceholder="Search by name, version, or vendor..."
        onRowClick={(os) => navigate(`/os/${os.id}`)}
        emptyMessage={loading ? "Loading..." : "No operating systems found"}
      />
    </div>
  );
}
