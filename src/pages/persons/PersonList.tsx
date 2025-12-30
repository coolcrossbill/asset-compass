import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { personApi, assignmentApi } from '@/services/api';
import { Person, Assignment } from '@/types/cmdb';

export default function PersonList() {
  const navigate = useNavigate();
  const [persons, setPersons] = useState<Person[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personsData, assignmentsData] = await Promise.all([
          personApi.getAll(),
          assignmentApi.getAll(),
        ]);
        setPersons(personsData);
        setAssignments(assignmentsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching persons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div className="flex items-center gap-1 text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="font-mono text-sm">{p.email}</span>
        </div>
      )
    },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'department', header: 'Department', sortable: true },
    { 
      key: 'phone', 
      header: 'Phone',
      render: (p) => p.phone ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span className="font-mono text-sm">{p.phone}</span>
        </div>
      ) : '-'
    },
    { 
      key: 'assignments', 
      header: 'Assignments',
      render: (p) => {
        const personAssignments = assignments.filter(a => a.personId === p.id);
        return <span className="text-muted-foreground">{personAssignments.length}</span>;
      }
    },
  ];

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Persons" 
          description="Manage people and their roles"
          icon={<Users className="h-6 w-6" />}
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
        title="Persons" 
        description="Manage people and their roles"
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
        searchPlaceholder="Search by name, email, role, or department..."
        onRowClick={(p) => navigate(`/persons/${p.id}`)}
        emptyMessage={loading ? "Loading..." : "No persons found"}
      />
    </div>
  );
}
