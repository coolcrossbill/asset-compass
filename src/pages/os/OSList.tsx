import { useNavigate } from 'react-router-dom';
import { HardDrive, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { operatingSystems, hosts } from '@/data/mockData';
import { OperatingSystem } from '@/types/cmdb';

export default function OSList() {
  const navigate = useNavigate();

  const columns: Column<OperatingSystem>[] = [
    { 
      key: 'name', 
      header: 'Name', 
      sortable: true,
      render: (os) => (
        <span className="font-medium text-foreground">{os.name}</span>
      )
    },
    { 
      key: 'version', 
      header: 'Version', 
      sortable: true,
      render: (os) => <span className="font-mono">{os.version}</span>
    },
    { key: 'vendor', header: 'Vendor', sortable: true },
    { 
      key: 'hosts', 
      header: 'Hosts Using',
      render: (os) => {
        const hostCount = hosts.filter(h => h.osId === os.id).length;
        return <span className="text-muted-foreground">{hostCount}</span>;
      }
    },
    { 
      key: 'eolDate', 
      header: 'EOL Date',
      render: (os) => os.eolDate ? (
        <span className={new Date(os.eolDate) < new Date() ? 'text-destructive' : 'text-muted-foreground'}>
          {os.eolDate}
        </span>
      ) : <span className="text-muted-foreground">—</span>
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Operating Systems" 
        description="Manage OS versions and lifecycle"
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
        emptyMessage="No operating systems found"
      />
    </div>
  );
}
