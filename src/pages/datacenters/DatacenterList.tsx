import { useNavigate } from 'react-router-dom';
import { Building2, Plus, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { datacenters, servers } from '@/data/mockData';
import { Datacenter } from '@/types/cmdb';

export default function DatacenterList() {
  const navigate = useNavigate();

  const columns: Column<Datacenter>[] = [
    { 
      key: 'name', 
      header: 'Name', 
      sortable: true,
      render: (dc) => (
        <span className="font-medium text-foreground">{dc.name}</span>
      )
    },
    { 
      key: 'location', 
      header: 'Location', 
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
      header: 'Servers',
      render: (dc) => {
        const serverCount = servers.filter(s => s.datacenterId === dc.id).length;
        return <span className="text-muted-foreground">{serverCount}</span>;
      }
    },
    { key: 'description', header: 'Description', className: 'max-w-xs truncate' },
    { key: 'updatedAt', header: 'Last Updated', sortable: true },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Datacenters" 
        description="Manage your datacenter facilities"
        icon={<Building2 className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Datacenter
          </Button>
        }
      />

      <DataTable 
        data={datacenters}
        columns={columns}
        searchKeys={['name', 'location']}
        searchPlaceholder="Search datacenters..."
        onRowClick={(dc) => navigate(`/datacenters/${dc.id}`)}
        emptyMessage="No datacenters found"
      />
    </div>
  );
}
