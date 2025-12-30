import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, Phone, Building, Briefcase, FileText, Link } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DetailCard, DetailRow } from '@/components/ui/DetailCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EntityLink } from '@/components/ui/EntityLink';
import { Button } from '@/components/ui/button';
import { persons, assignments, datacenters, servers, hosts } from '@/data/mockData';
import { Assignment } from '@/types/cmdb';

export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const person = persons.find(p => p.id === id);
  const personAssignments = assignments.filter(a => a.personId === id);

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Person not found</p>
        <Button variant="link" onClick={() => navigate('/persons')}>
          Back to Persons
        </Button>
      </div>
    );
  }

  const getEntityName = (a: Assignment) => {
    switch (a.entityType) {
      case 'datacenter':
        return datacenters.find(dc => dc.id === a.entityId)?.name;
      case 'server':
        return servers.find(s => s.id === a.entityId)?.hostname;
      case 'host':
        return hosts.find(h => h.id === a.entityId)?.hostname;
      default:
        return a.entityId;
    }
  };

  const getEntityLink = (a: Assignment) => {
    switch (a.entityType) {
      case 'datacenter':
        return `/datacenters/${a.entityId}`;
      case 'server':
        return `/servers/${a.entityId}`;
      case 'host':
        return `/hosts/${a.entityId}`;
      default:
        return '#';
    }
  };

  const assignmentColumns: Column<Assignment>[] = [
    { 
      key: 'entityType', 
      header: 'Type',
      render: (a) => <span className="capitalize">{a.entityType}</span>
    },
    { 
      key: 'entity', 
      header: 'Entity',
      render: (a) => (
        <EntityLink to={getEntityLink(a)}>
          {getEntityName(a)}
        </EntityLink>
      )
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (a) => <StatusBadge status={a.role} />
    },
    { key: 'createdAt', header: 'Assigned' },
  ];

  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate('/persons')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Persons
      </Button>

      <PageHeader 
        title={person.name}
        description={`${person.role} • ${person.department}`}
        icon={<Users className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DetailCard title="Contact Information" icon={<FileText className="h-4 w-4" />}>
          <DetailRow label="Name" value={person.name} />
          <DetailRow 
            label="Email" 
            value={
              <a 
                href={`mailto:${person.email}`} 
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                {person.email}
              </a>
            } 
          />
          {person.phone && (
            <DetailRow 
              label="Phone" 
              value={
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {person.phone}
                </span>
              } 
            />
          )}
        </DetailCard>

        <DetailCard title="Organization" icon={<Building className="h-4 w-4" />}>
          <DetailRow 
            label="Role" 
            value={
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {person.role}
              </span>
            } 
          />
          <DetailRow 
            label="Department" 
            value={
              <span className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {person.department}
              </span>
            } 
          />
          <DetailRow label="Created" value={person.createdAt} />
          <DetailRow label="Last Updated" value={person.updatedAt} />
        </DetailCard>
      </div>

      <DetailCard title="Assignments" icon={<Link className="h-4 w-4" />} className="mt-6">
        <DataTable 
          data={personAssignments}
          columns={assignmentColumns}
          emptyMessage="No assignments"
        />
      </DetailCard>
    </div>
  );
}
