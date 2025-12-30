import { useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { persons, assignments } from '@/data/mockData';
import { Person } from '@/types/cmdb';

export default function PersonList() {
  const navigate = useNavigate();

  const columns: Column<Person>[] = [
    { 
      key: 'name', 
      header: 'Name', 
      sortable: true,
      render: (p) => (
        <span className="font-medium text-foreground">{p.name}</span>
      )
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (p) => (
        <a 
          href={`mailto:${p.email}`} 
          className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Mail className="h-4 w-4" />
          {p.email}
        </a>
      )
    },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'department', header: 'Department', sortable: true },
    { 
      key: 'assignments', 
      header: 'Assignments',
      render: (p) => {
        const count = assignments.filter(a => a.personId === p.id).length;
        return <span className="text-muted-foreground">{count}</span>;
      }
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Persons" 
        description="Manage responsible personnel"
        icon={<Users className="h-6 w-6" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Person
          </Button>
        }
      />

      <DataTable 
        data={persons}
        columns={columns}
        searchKeys={['name', 'email', 'role', 'department']}
        searchPlaceholder="Search by name, email, role..."
        onRowClick={(p) => navigate(`/persons/${p.id}`)}
        emptyMessage="No persons found"
      />
    </div>
  );
}
